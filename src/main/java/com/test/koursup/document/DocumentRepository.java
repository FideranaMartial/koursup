package com.test.koursup.document;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    Page<Document> findByFiliere(String filiere, Pageable pageable);

    Page<Document> findByNiveau(String niveau, Pageable pageable);

    Page<Document> findByType(TypeDocument type, Pageable pageable);

    Page<Document> findByFiliereAndNiveau(
            String filiere, String niveau, Pageable pageable);

    @Query("SELECT d FROM Document d WHERE " +
            "LOWER(d.titre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(d.matiere) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Document> search(@Param("keyword") String keyword, Pageable pageable);

    List<Document> findByAuteurIdOrderByCreatedAtDesc(Long auteurId);

    List<Document> findTop10ByOrderByNombreTelechargementsDesc();

    @Query("SELECT d FROM Document d WHERE " +
            "(:filiere IS NULL OR d.filiere = :filiere) AND " +
            "(:niveau IS NULL OR d.niveau = :niveau) AND " +
            "(:type IS NULL OR d.type = :type)")
    Page<Document> filtrer(
            @Param("filiere") String filiere,
            @Param("niveau") String niveau,
            @Param("type") TypeDocument type,
            Pageable pageable
    );
}