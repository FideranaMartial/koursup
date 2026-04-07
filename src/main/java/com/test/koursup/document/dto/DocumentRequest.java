package com.test.koursup.document.dto;

import com.test.koursup.document.TypeDocument;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentRequest {

    @NotBlank
    private String titre;

    private String description;

    @NotBlank
    private String filiere;

    @NotBlank
    private String niveau;

    @NotBlank
    private String matiere;

    @NotNull
    private TypeDocument type;
}