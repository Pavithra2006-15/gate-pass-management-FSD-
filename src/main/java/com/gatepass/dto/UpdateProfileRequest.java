package com.gatepass.dto;

public class UpdateProfileRequest {
    public String phone;
    public String currentPassword;
    public String newPassword;

    public String getPhone() { return phone; }
    public String getCurrentPassword() { return currentPassword; }
    public String getNewPassword() { return newPassword; }
}
