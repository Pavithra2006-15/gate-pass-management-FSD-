package com.gatepass.dto;

public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String department;
    private String token;

    public AuthResponse() {}

    public AuthResponse(Long id, String name, String email, String role, String department, String token) {
        this.id = id; this.name = name; this.email = email;
        this.role = role; this.department = department; this.token = token;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getDepartment() { return department; }
    public String getToken() { return token; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
    public void setDepartment(String department) { this.department = department; }
    public void setToken(String token) { this.token = token; }
}
