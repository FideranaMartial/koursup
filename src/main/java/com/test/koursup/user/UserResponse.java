package com.test.koursup.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private int karma;
    private String role;
    private String filiere;
    private String niveau;
}