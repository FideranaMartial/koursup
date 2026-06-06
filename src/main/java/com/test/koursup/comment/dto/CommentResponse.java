package com.test.koursup.comment.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String contenu;
    private String auteurNom;
    private String auteurPrenom;
    private String auteurEmail;
    private Long documentId;
    private LocalDateTime createdAt;
}