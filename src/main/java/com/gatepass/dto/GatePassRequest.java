package com.gatepass.dto;

import jakarta.validation.constraints.NotBlank;

public class GatePassRequest {
    @NotBlank public String reason;
    @NotBlank public String date;
    @NotBlank public String outTime;
    @NotBlank public String expectedReturnTime;
    public String destination;

    public String getReason() { return reason; }
    public String getDate() { return date; }
    public String getOutTime() { return outTime; }
    public String getExpectedReturnTime() { return expectedReturnTime; }
    public String getDestination() { return destination; }
}
