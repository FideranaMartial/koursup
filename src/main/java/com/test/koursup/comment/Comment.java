package com.test.koursup.comment;

import com.test.koursup.document.Document;
import com.test.koursup.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String contenu;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User auteur;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}