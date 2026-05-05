package com.gatepass.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gatepass.dto.UpdateProfileRequest;
import com.gatepass.entity.GatePass;
import com.gatepass.entity.User;
import com.gatepass.exception.BadRequestException;
import com.gatepass.exception.ResourceNotFoundException;
import com.gatepass.repository.GatePassRepository;
import com.gatepass.repository.UserRepository;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private GatePassRepository gatePassRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    public Map<String, Object> getProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("user", user);

        if (user.getRole() == User.Role.student) {
            List<GatePass> passes = gatePassRepository.findByStudentIdOrderByCreatedAtDesc(userId);
            response.put("stats", Map.of(
                "totalPasses", passes.size(),
                "approved", passes.stream().filter(p -> p.getStatus() == GatePass.Status.approved).count(),
                "rejected", passes.stream().filter(p -> p.getStatus() == GatePass.Status.rejected).count(),
                "pending", passes.stream().filter(p -> p.getStatus() == GatePass.Status.pending).count()
            ));
        } else if (user.getRole() == User.Role.faculty) {
            long assignedStudents = userRepository.countByRole(User.Role.student);
            response.put("stats", Map.of(
                "assignedStudents", assignedStudents,
                "totalApprovals", gatePassRepository.countByApprovedByIdAndStatus(userId, GatePass.Status.approved),
                "totalRejections", gatePassRepository.countByApprovedByIdAndStatus(userId, GatePass.Status.rejected)
            ));
        }

        return response;
    }

    public void updateProfile(Long userId, UpdateProfileRequest req) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (req.phone != null) user.setPhone(req.phone);

        if (req.newPassword != null && !req.newPassword.isEmpty()) {
            if (req.currentPassword == null) {
                throw new BadRequestException("Current password required");
            }
            if (!passwordEncoder.matches(req.currentPassword, user.getPassword())) {
                throw new BadRequestException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(req.newPassword));
        }

        userRepository.save(user);
    }

    public Map<String, Long> getDashboardStats() {
        return Map.of(
            "totalUsers", userRepository.count(),
            "students", userRepository.countByRole(User.Role.student),
            "faculty", userRepository.countByRole(User.Role.faculty),
            "security", userRepository.countByRole(User.Role.security)
        );
    }

    // Assign faculty to student
    public User assignFaculty(Long studentId, Long facultyId) {
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        User faculty = userRepository.findById(facultyId)
            .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        student.setAssignedFaculty(faculty);
        return userRepository.save(student);
    }
}
