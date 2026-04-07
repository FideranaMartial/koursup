package com.test.koursup.document;

import com.test.koursup.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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

    private int nombreTelechargements = 0;

    private double noteMoyenne = 0.0;

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