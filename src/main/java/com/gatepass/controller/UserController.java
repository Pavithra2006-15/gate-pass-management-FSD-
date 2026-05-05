package com.gatepass.controller;

import com.gatepass.dto.UpdateProfileRequest;
import com.gatepass.entity.User;
import com.gatepass.security.UserDetailsImpl;
import com.gatepass.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired private UserService userService;

    // GET /api/users - Admin: get all users
    @GetMapping("/api/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // DELETE /api/users/{id} - Admin: delete user
    @DeleteMapping("/api/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    // PUT /api/users/{studentId}/assign-faculty/{facultyId} - Admin: assign faculty
    @PutMapping("/api/users/{studentId}/assign-faculty/{facultyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> assignFaculty(@PathVariable Long studentId, @PathVariable Long facultyId) {
        return ResponseEntity.ok(userService.assignFaculty(studentId, facultyId));
    }

    // GET /api/users/stats - Admin: dashboard stats
    @GetMapping("/api/users/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(userService.getDashboardStats());
    }

    // GET /api/profile/me - Get own profile
    @GetMapping("/api/profile/me")
    public ResponseEntity<Map<String, Object>> getProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(userService.getProfile(userDetails.getId()));
    }

    // PUT /api/profile/me - Update own profile
    @PutMapping("/api/profile/me")
    public ResponseEntity<Map<String, String>> updateProfile(
            @RequestBody UpdateProfileRequest req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        userService.updateProfile(userDetails.getId(), req);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }
}
