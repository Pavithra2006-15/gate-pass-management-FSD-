package com.gatepass.service;

import com.gatepass.dto.*;
import com.gatepass.entity.GatePass;
import com.gatepass.entity.User;
import com.gatepass.exception.BadRequestException;
import com.gatepass.exception.ResourceNotFoundException;
import com.gatepass.repository.GatePassRepository;
import com.gatepass.repository.UserRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GatePassService {

    @Autowired private GatePassRepository gatePassRepository;
    @Autowired private UserRepository userRepository;

    // Student: Apply for gate pass
    public GatePass apply(GatePassRequest req, Long studentId) {
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        GatePass gatePass = GatePass.builder()
            .student(student)
            .faculty(student.getAssignedFaculty())
            .reason(req.reason)
            .date(LocalDate.parse(req.date))
            .outTime(req.outTime)
            .expectedReturnTime(req.expectedReturnTime)
            .destination(req.destination)
            .status(GatePass.Status.pending)
            .build();

        return gatePassRepository.save(gatePass);
    }

    // Student: Get my gate passes
    public List<GatePass> getMyPasses(Long studentId) {
        return gatePassRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    // Faculty: Get pending passes - ALL pending (not just assigned)
    public List<GatePass> getPendingPasses(Long facultyId) {
        // Return all pending passes so faculty can see and act on them
        return gatePassRepository.findByStatusOrderByCreatedAtDesc(GatePass.Status.pending);
    }

    // Faculty: Get all passes for history view
    public List<GatePass> getAllPendingAndReviewed() {
        return gatePassRepository.findAll()
            .stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .collect(java.util.stream.Collectors.toList());
    }

    // Security: Get today's approved passes
    public List<GatePass> getApprovedPassesForToday() {
        return gatePassRepository.findApprovedPassesForToday(LocalDate.now());
    }

    // Faculty: Approve gate pass
    public GatePass approve(Long passId, ApproveRejectRequest req, Long facultyId) throws Exception {
        GatePass gatePass = gatePassRepository.findById(passId)
            .orElseThrow(() -> new ResourceNotFoundException("Gate pass not found"));

        User faculty = userRepository.findById(facultyId)
            .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        // Generate QR code
        String qrData = String.format("{\"id\":%d,\"studentId\":%d,\"date\":\"%s\"}",
            gatePass.getId(), gatePass.getStudent().getId(), gatePass.getDate());
        String qrCode = generateQRCode(qrData);

        gatePass.setStatus(GatePass.Status.approved);
        gatePass.setApprovedBy(faculty);
        gatePass.setRemarks(req.remarks);
        gatePass.setQrCode(qrCode);
        gatePass.setQrCodeData(qrData);

        return gatePassRepository.save(gatePass);
    }

    // Faculty: Reject gate pass
    public GatePass reject(Long passId, ApproveRejectRequest req, Long facultyId) {
        GatePass gatePass = gatePassRepository.findById(passId)
            .orElseThrow(() -> new ResourceNotFoundException("Gate pass not found"));

        User faculty = userRepository.findById(facultyId)
            .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        gatePass.setStatus(GatePass.Status.rejected);
        gatePass.setApprovedBy(faculty);
        gatePass.setRemarks(req.remarks);

        return gatePassRepository.save(gatePass);
    }

    // Security: Verify gate pass
    public GatePass verify(Long gatePassId) {
        GatePass gatePass = gatePassRepository.findById(gatePassId)
            .orElseThrow(() -> new ResourceNotFoundException("Gate pass not found"));

        if (gatePass.getStatus() != GatePass.Status.approved) {
            throw new BadRequestException("Gate pass is not approved");
        }

        if (!gatePass.getDate().equals(LocalDate.now())) {
            gatePass.setStatus(GatePass.Status.expired);
            gatePassRepository.save(gatePass);
            throw new BadRequestException("Gate pass has expired");
        }

        return gatePass;
    }

    // Security: Record exit time
    public GatePass recordExit(Long passId) {
        GatePass gatePass = gatePassRepository.findById(passId)
            .orElseThrow(() -> new ResourceNotFoundException("Gate pass not found"));

        gatePass.setExitTime(LocalDateTime.now());
        return gatePassRepository.save(gatePass);
    }

    // Security: Record entry time
    public GatePass recordEntry(Long passId) {
        GatePass gatePass = gatePassRepository.findById(passId)
            .orElseThrow(() -> new ResourceNotFoundException("Gate pass not found"));

        gatePass.setEntryTime(LocalDateTime.now());
        gatePass.setStatus(GatePass.Status.completed);
        return gatePassRepository.save(gatePass);
    }

    // Admin: Get all gate passes with filters
    public List<GatePass> getAllPasses(String department, String date) {
        if (department != null && date != null) {
            return gatePassRepository.findByDepartmentAndDate(department, LocalDate.parse(date));
        } else if (department != null) {
            return gatePassRepository.findByStudentDepartment(department);
        } else if (date != null) {
            return gatePassRepository.findByDateOrderByCreatedAtDesc(LocalDate.parse(date));
        }
        return gatePassRepository.findAll();
    }

    // Generate QR Code as base64 image
    private String generateQRCode(String data) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, 200, 200);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        byte[] qrBytes = outputStream.toByteArray();
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(qrBytes);
    }

    // Stats for admin dashboard
    public Map<String, Long> getStats() {
        return Map.of(
            "total", gatePassRepository.count(),
            "pending", gatePassRepository.countByStatus(GatePass.Status.pending),
            "approved", gatePassRepository.countByStatus(GatePass.Status.approved),
            "rejected", gatePassRepository.countByStatus(GatePass.Status.rejected)
        );
    }
}
