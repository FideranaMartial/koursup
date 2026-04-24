package com.test.koursup.dashboard.dto;

import lombok.Data;

@Data
public class DocumentInfo {
    private Long id;
    private String titre;
    private String description;
    private String filiere;
    private String niveau;
    private String matiere;
    private String type;
    private double noteMoyenne;
    private int nombreTelechargements;
    private String auteurNom;
    private String auteurPrenom;
}