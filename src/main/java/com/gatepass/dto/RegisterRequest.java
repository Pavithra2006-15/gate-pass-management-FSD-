package com.gatepass.dto;

import com.gatepass.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank public String name;
    @Email @NotBlank public String email;
    @NotBlank @Size(min = 6) public String password;
    public String department;
    public String registerNumber;
    public String year;
    public String phone;
    public User.Role role;

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getDepartment() { return department; }
    public String getRegisterNumber() { return registerNumber; }
    public String getYear() { return year; }
    public String getPhone() { return phone; }
    public User.Role getRole() { return role; }
}
