package com.test.koursup.user;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String nom;
    private String prenom;
    private String filiere;
    private String niveau;
}