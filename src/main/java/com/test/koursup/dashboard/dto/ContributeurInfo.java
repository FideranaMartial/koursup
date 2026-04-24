package com.test.koursup.dashboard.dto;

import lombok.Data;

@Data
public class ContributeurInfo {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String filiere;
    private int karma;
    private int nombreDocuments;
}