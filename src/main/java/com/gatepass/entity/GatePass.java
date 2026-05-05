package com.gatepass.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "gate_passes")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class GatePass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id")
    private User faculty;

    @NotBlank
    @Column(nullable = false)
    private String reason;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    @NotBlank
    @Column(name = "out_time", nullable = false)
    private String outTime;

    @NotBlank
    @Column(name = "expected_return_time", nullable = false)
    private String expectedReturnTime;

    private String destination;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.pending;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    private String remarks;

    @Column(name = "qr_code", columnDefinition = "TEXT")
    private String qrCode;

    @Column(name = "qr_code_data")
    private String qrCodeData;

    @Column(name = "exit_time")
    private LocalDateTime exitTime;

    @Column(name = "entry_time")
    private LocalDateTime entryTime;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Status {
        pending, approved, rejected, expired, completed
    }

    // Default constructor
    public GatePass() {}

    // Getters
    public Long getId() { return id; }
    public User getStudent() { return student; }
    public User getFaculty() { return faculty; }
    public String getReason() { return reason; }
    public LocalDate getDate() { return date; }
    public String getOutTime() { return outTime; }
    public String getExpectedReturnTime() { return expectedReturnTime; }
    public String getDestination() { return destination; }
    public Status getStatus() { return status; }
    public User getApprovedBy() { return approvedBy; }
    public String getRemarks() { return remarks; }
    public String getQrCode() { return qrCode; }
    public String getQrCodeData() { return qrCodeData; }
    public LocalDateTime getExitTime() { return exitTime; }
    public LocalDateTime getEntryTime() { return entryTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setStudent(User student) { this.student = student; }
    public void setFaculty(User faculty) { this.faculty = faculty; }
    public void setReason(String reason) { this.reason = reason; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setOutTime(String outTime) { this.outTime = outTime; }
    public void setExpectedReturnTime(String expectedReturnTime) { this.expectedReturnTime = expectedReturnTime; }
    public void setDestination(String destination) { this.destination = destination; }
    public void setStatus(Status status) { this.status = status; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
    public void setQrCodeData(String qrCodeData) { this.qrCodeData = qrCodeData; }
    public void setExitTime(LocalDateTime exitTime) { this.exitTime = exitTime; }
    public void setEntryTime(LocalDateTime entryTime) { this.entryTime = entryTime; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User student, faculty, approvedBy;
        private String reason, outTime, expectedReturnTime, destination, remarks, qrCode, qrCodeData;
        private LocalDate date;
        private Status status = Status.pending;

        public Builder student(User student) { this.student = student; return this; }
        public Builder faculty(User faculty) { this.faculty = faculty; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder date(LocalDate date) { this.date = date; return this; }
        public Builder outTime(String outTime) { this.outTime = outTime; return this; }
        public Builder expectedReturnTime(String t) { this.expectedReturnTime = t; return this; }
        public Builder destination(String destination) { this.destination = destination; return this; }
        public Builder status(Status status) { this.status = status; return this; }
        public Builder approvedBy(User approvedBy) { this.approvedBy = approvedBy; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }
        public Builder qrCode(String qrCode) { this.qrCode = qrCode; return this; }
        public Builder qrCodeData(String qrCodeData) { this.qrCodeData = qrCodeData; return this; }

        public GatePass build() {
            GatePass g = new GatePass();
            g.student = student; g.faculty = faculty; g.reason = reason;
            g.date = date; g.outTime = outTime; g.expectedReturnTime = expectedReturnTime;
            g.destination = destination; g.status = status; g.approvedBy = approvedBy;
            g.remarks = remarks; g.qrCode = qrCode; g.qrCodeData = qrCodeData;
            return g;
        }
    }
}
