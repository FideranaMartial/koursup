package com.test.koursup.document;

import com.test.koursup.document.dto.DocumentRequest;
import com.test.koursup.document.dto.DocumentResponse;
import com.test.koursup.user.User;
import com.test.koursup.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    private final String uploadDir = "uploads/";

    public DocumentResponse upload(DocumentRequest request,
                                   MultipartFile fichier,
                                   String email) throws IOException {

        User auteur = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Créer le dossier uploads s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom unique pour le fichier
        String nomUnique = UUID.randomUUID() + "_" + fichier.getOriginalFilename();
        Path cheminFichier = uploadPath.resolve(nomUnique);
        Files.copy(fichier.getInputStream(), cheminFichier,
                StandardCopyOption.REPLACE_EXISTING);

        Document document = Document.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .filiere(request.getFiliere())
                .niveau(request.getNiveau())
                .matiere(request.getMatiere())
                .type(request.getType())
                .cheminFichier(cheminFichier.toString())
                .nomFichier(fichier.getOriginalFilename())
                .tailleFichier(fichier.getSize())
                .auteur(auteur)
                .build();

        documentRepository.save(document);

        // Ajouter du karma à l'auteur
        auteur.setKarma(auteur.getKarma() + 10);
        userRepository.save(auteur);

        return toResponse(document);
    }

    public Page<DocumentResponse> listerTous(int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("createdAt").descending());
        return documentRepository.findAll(pageable).map(this::toResponse);
    }

    public Page<DocumentResponse> rechercher(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("createdAt").descending());
        return documentRepository.search(keyword, pageable).map(this::toResponse);
    }

    public Page<DocumentResponse> filtrerParFiliere(String filiere,
                                                    int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("createdAt").descending());
        return documentRepository.findByFiliere(filiere, pageable)
                .map(this::toResponse);
    }

    public Page<DocumentResponse> filtrerParFiliereEtNiveau(String filiere,
                                                            String niveau,
                                                            int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("createdAt").descending());
        return documentRepository.findByFiliereAndNiveau(filiere, niveau, pageable)
                .map(this::toResponse);
    }

    public DocumentResponse getById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));
        return toResponse(document);
    }

    public Path telecharger(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

        document.setNombreTelechargements(
                document.getNombreTelechargements() + 1);
        documentRepository.save(document);

        return Paths.get(document.getCheminFichier());
    }

    public List<DocumentResponse> mesDocuments(String email) {
        User auteur = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return documentRepository
                .findByAuteurIdOrderByCreatedAtDesc(auteur.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DocumentResponse> topDocuments() {
        return documentRepository.findTop10ByOrderByNombreTelechargementsDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private DocumentResponse toResponse(Document d) {
        return DocumentResponse.builder()
                .id(d.getId())
                .titre(d.getTitre())
                .description(d.getDescription())
                .filiere(d.getFiliere())
                .niveau(d.getNiveau())
                .matiere(d.getMatiere())
                .type(d.getType())
                .nomFichier(d.getNomFichier())
                .tailleFichier(d.getTailleFichier())
                .nombreTelechargements(d.getNombreTelechargements())
                .noteMoyenne(d.getNoteMoyenne())
                .nombreNotes(d.getNombreNotes())
                .auteurNom(d.getAuteur().getNom())
                .auteurPrenom(d.getAuteur().getPrenom())
                .createdAt(d.getCreatedAt())
                .build();
    }

    public Page<DocumentResponse> filtrer(String filiere, String niveau,
                                          String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("createdAt").descending());

        TypeDocument typeDoc = null;
        if (type != null && !type.isEmpty()) {
            typeDoc = TypeDocument.valueOf(type);
        }

        String filiereParam = (filiere != null && !filiere.isEmpty()) ? filiere : null;
        String niveauParam = (niveau != null && !niveau.isEmpty()) ? niveau : null;

        return documentRepository.filtrer(filiereParam, niveauParam, typeDoc, pageable)
                .map(this::toResponse);
    }
}