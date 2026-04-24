package com.test.koursup.dashboard.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    private long totalDocuments;
    private DocumentInfo meilleurNote;
    private DocumentInfo plusTelecharge;
    private ContributeurInfo topContributeur;
}