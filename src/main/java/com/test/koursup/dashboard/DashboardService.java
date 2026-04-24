package com.test.koursup.dashboard;

import com.test.koursup.dashboard.dto.*;
import com.test.koursup.document.Document;
import com.test.koursup.document.DocumentRepository;
import com.test.koursup.user.User;
import com.test.koursup.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // 1. Nombre total de documents
        stats.setTotalDocuments(documentRepository.count());

        // 2. Document le mieux noté
        List<Document> bestRatedDocs = documentRepository.findTop1ByOrderByNoteMoyenneDesc();
        if (!bestRatedDocs.isEmpty()) {
            stats.setMeilleurNote(convertToDocumentInfo(bestRatedDocs.get(0)));
        }

        // 3. Document le plus téléchargé
        List<Document> mostDownloadedDocs = documentRepository.findTop1ByOrderByNombreTelechargementsDesc();
        if (!mostDownloadedDocs.isEmpty()) {
            stats.setPlusTelecharge(convertToDocumentInfo(mostDownloadedDocs.get(0)));
        }

        // 4. Top contributeur
        List<User> topContributors = userRepository.findTop1ByOrderByKarmaDesc();
        if (!topContributors.isEmpty()) {
            stats.setTopContributeur(convertToContributeurInfo(topContributors.get(0)));
        }

        return stats;
    }

    private DocumentInfo convertToDocumentInfo(Document document) {
        DocumentInfo info = new DocumentInfo();
        info.setId(document.getId());
        info.setTitre(document.getTitre());
        info.setDescription(document.getDescription());
        info.setFiliere(document.getFiliere());
        info.setNiveau(document.getNiveau());
        info.setMatiere(document.getMatiere());
        info.setType(document.getType() != null ? document.getType().name() : null);
        info.setNoteMoyenne(document.getNoteMoyenne());
        info.setNombreTelechargements(document.getNombreTelechargements());
        if (document.getAuteur() != null) {
            info.setAuteurNom(document.getAuteur().getNom());
            info.setAuteurPrenom(document.getAuteur().getPrenom());
        }
        return info;
    }

    private ContributeurInfo convertToContributeurInfo(User user) {
        ContributeurInfo info = new ContributeurInfo();
        info.setId(user.getId());
        info.setNom(user.getNom());
        info.setPrenom(user.getPrenom());
        info.setEmail(user.getEmail());
        info.setFiliere(user.getFiliere());
        info.setKarma(user.getKarma());
        info.setNombreDocuments(documentRepository.countByAuteurId(user.getId()));
        return info;
    }
}