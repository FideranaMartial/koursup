package com.test.koursup.rating;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    // Cherche la note d'un utilisateur sur un document spécifique
    Optional<Rating> findByUserIdAndDocumentId(Long userId, Long documentId);

    // Calcule la moyenne des notes d'un document
    @Query("SELECT AVG(r.note) FROM Rating r WHERE r.document.id = :documentId")
    Double calculerMoyenne(@Param("documentId") Long documentId);

    // Compte le nombre de notes d'un document
    int countByDocumentId(Long documentId);
    void deleteByDocumentId(Long documentId);
}