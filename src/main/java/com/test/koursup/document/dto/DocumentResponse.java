package com.test.koursup.document.dto;

import com.test.koursup.document.TypeDocument;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DocumentResponse {
    private Long id;
    private String titre;
    private String description;
    private String filiere;
    private String niveau;
    private String matiere;
    private TypeDocument type;
    private String nomFichier;
    private long tailleFichier;
    private int nombreTelechargements;
    private double noteMoyenne;
    private int nombreNotes;
    private String auteurNom;
    private String auteurPrenom;
    private LocalDateTime createdAt;
}