package com.test.koursup.document;

import java.time.LocalDateTime;

import com.test.koursup.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    private String description;

    @Column(nullable = false)
    private String filiere;

    @Column(nullable = false)
    private String niveau;

    @Column(nullable = false)
    private String matiere;

    @Enumerated(EnumType.STRING)
    private TypeDocument type;

    @Column(nullable = false)
    private String cheminFichier;

    private String nomFichier;

    private long tailleFichier;

    @Builder.Default
    private int nombreTelechargements = 0;

    @Builder.Default
    private double noteMoyenne = 0.0;

    @Builder.Default
    private int nombreNotes = 0;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User auteur;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}