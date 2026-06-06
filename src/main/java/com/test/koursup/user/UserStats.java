package com.test.koursup.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStats {
    private String nom;
    private String prenom;
    private String email;
    private String filiere;
    private String niveau;
    private int karma;
    private long totalDocuments;
    private int totalTelechargements;
    private String badge;
}