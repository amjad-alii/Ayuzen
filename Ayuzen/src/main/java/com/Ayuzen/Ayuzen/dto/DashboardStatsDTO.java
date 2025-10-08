package com.Ayuzen.Ayuzen.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDTO {
    private long totalDoctors;
    private long appointmentsToday;
    private double totalRevenueToday;
}