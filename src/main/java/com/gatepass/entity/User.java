package com.gatepass.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@JsonIgnoreProperties({"gatePasses", "assignedFaculty", "hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String department;

    @Column(name = "register_number")
    private String registerNumber;

    private String year;

    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_faculty_id")
    private User assignedFaculty;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GatePass> gatePasses;

    public enum Role {
        student, faculty, security, admin
    }

    // Default constructor
    public User() {}

    // All-args constructor
    public User(Long id, String name, String email, String password, Role role,
                String department, String registerNumber, String year, String phone,
                User assignedFaculty, LocalDateTime createdAt, List<GatePass> gatePasses) {
        this.id = id; this.name = name; this.email = email; this.password = password;
        this.role = role; this.department = department; this.registerNumber = registerNumber;
        this.year = year; this.phone = phone; this.assignedFaculty = assignedFaculty;
        this.createdAt = createdAt; this.gatePasses = gatePasses;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public Role getRole() { return role; }
    public String getDepartment() { return department; }
    public String getRegisterNumber() { return registerNumber; }
    public String getYear() { return year; }
    public String getPhone() { return phone; }
    public User getAssignedFaculty() { return assignedFaculty; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<GatePass> getGatePasses() { return gatePasses; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(Role role) { this.role = role; }
    public void setDepartment(String department) { this.department = department; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public void setYear(String year) { this.year = year; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setAssignedFaculty(User assignedFaculty) { this.assignedFaculty = assignedFaculty; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setGatePasses(List<GatePass> gatePasses) { this.gatePasses = gatePasses; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name, email, password, department, registerNumber, year, phone;
        private Role role;
        private User assignedFaculty;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder department(String department) { this.department = department; return this; }
        public Builder registerNumber(String registerNumber) { this.registerNumber = registerNumber; return this; }
        public Builder year(String year) { this.year = year; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder assignedFaculty(User assignedFaculty) { this.assignedFaculty = assignedFaculty; return this; }

        public User build() {
            User u = new User();
            u.id = id; u.name = name; u.email = email; u.password = password;
            u.role = role; u.department = department; u.registerNumber = registerNumber;
            u.year = year; u.phone = phone; u.assignedFaculty = assignedFaculty;
            return u;
        }
    }
}
