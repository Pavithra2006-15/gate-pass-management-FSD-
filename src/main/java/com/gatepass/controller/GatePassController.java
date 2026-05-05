package com.gatepass.controller;

import com.gatepass.dto.*;
import com.gatepass.entity.GatePass;
import com.gatepass.security.UserDetailsImpl;
import com.gatepass.service.GatePassService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gatepass")
@CrossOrigin(origins = "http://localhost:3000")
public class GatePassController {

    @Autowired private GatePassService gatePassService;

    // POST /api/gatepass/apply - Student applies
    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<GatePass> apply(
            @Valid @RequestBody GatePassRequest req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) throws Exception {
        return ResponseEntity.ok(gatePassService.apply(req, userDetails.getId()));
    }

    // GET /api/gatepass/my - Student views own passes
    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<GatePass>> getMyPasses(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(gatePassService.getMyPasses(userDetails.getId()));
    }

    // GET /api/gatepass/pending - Faculty views pending
    @GetMapping("/pending")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<List<GatePass>> getPending(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(gatePassService.getPendingPasses(userDetails.getId()));
    }

    // GET /api/gatepass/faculty-history - Faculty views all passes
    @GetMapping("/faculty-history")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<List<GatePass>> getFacultyHistory() {
        return ResponseEntity.ok(gatePassService.getAllPendingAndReviewed());
    }

    // GET /api/gatepass/approved-today - Security views today's approved passes
    @GetMapping("/approved-today")
    @PreAuthorize("hasRole('SECURITY')")
    public ResponseEntity<List<GatePass>> getApprovedToday() {
        return ResponseEntity.ok(gatePassService.getApprovedPassesForToday());
    }

    // PUT /api/gatepass/approve/{id} - Faculty approves
    @PutMapping("/approve/{id}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<GatePass> approve(
            @PathVariable Long id,
            @RequestBody ApproveRejectRequest req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) throws Exception {
        return ResponseEntity.ok(gatePassService.approve(id, req, userDetails.getId()));
    }

    // PUT /api/gatepass/reject/{id} - Faculty rejects
    @PutMapping("/reject/{id}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<GatePass> reject(
            @PathVariable Long id,
            @RequestBody ApproveRejectRequest req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(gatePassService.reject(id, req, userDetails.getId()));
    }

    // POST /api/gatepass/verify - Security verifies
    @PostMapping("/verify")
    @PreAuthorize("hasRole('SECURITY')")
    public ResponseEntity<Map<String, Object>> verify(@RequestBody Map<String, Long> body) {
        GatePass gatePass = gatePassService.verify(body.get("gatePassId"));
        return ResponseEntity.ok(Map.of("valid", true, "gatePass", gatePass));
    }

    // PUT /api/gatepass/exit/{id} - Security records exit
    @PutMapping("/exit/{id}")
    @PreAuthorize("hasRole('SECURITY')")
    public ResponseEntity<GatePass> recordExit(@PathVariable Long id) {
        return ResponseEntity.ok(gatePassService.recordExit(id));
    }

    // PUT /api/gatepass/entry/{id} - Security records entry
    @PutMapping("/entry/{id}")
    @PreAuthorize("hasRole('SECURITY')")
    public ResponseEntity<GatePass> recordEntry(@PathVariable Long id) {
        return ResponseEntity.ok(gatePassService.recordEntry(id));
    }

    // GET /api/gatepass/all - Admin views all
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GatePass>> getAll(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(gatePassService.getAllPasses(department, date));
    }

    // GET /api/gatepass/stats - Admin stats
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(gatePassService.getStats());
    }
}
