package com.test.koursup.user;

import com.test.koursup.document.DocumentRepository;
import com.test.koursup.document.DocumentService;
import com.test.koursup.document.dto.DocumentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final DocumentService documentService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(toResponse(user));
    }

    @GetMapping("/classement")
    public ResponseEntity<List<UserResponse>> getClassement() {
        return ResponseEntity.ok(
                userRepository.findTop10ByOrderByKarmaDesc()
                        .stream()
                        .map(this::toResponse)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/me/stats")
    public ResponseEntity<UserStats> getStats(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        long totalDocuments = documentRepository.countByAuteurId(user.getId());
        int totalTelechargements = documentRepository
                .findByAuteurIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .mapToInt(d -> d.getNombreTelechargements())
                .sum();

        return ResponseEntity.ok(new UserStats(
                user.getNom(),
                user.getPrenom(),
                user.getEmail(),
                user.getFiliere(),
                user.getNiveau(),
                user.getKarma(),
                totalDocuments,
                totalTelechargements,
                getBadge(user.getKarma())
        ));
    }

    @GetMapping("/me/documents")
    public ResponseEntity<List<DocumentResponse>> mesDocuments(
            Authentication auth) {
        return ResponseEntity.ok(
                documentService.mesDocuments(auth.getName())
        );
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (request.getNom() != null) user.setNom(request.getNom());
        if (request.getPrenom() != null) user.setPrenom(request.getPrenom());
        if (request.getFiliere() != null) user.setFiliere(request.getFiliere());
        if (request.getNiveau() != null) user.setNiveau(request.getNiveau());

        userRepository.save(user);
        return ResponseEntity.ok(toResponse(user));
    }

    private String getBadge(int karma) {
        if (karma >= 500) return "EXPERT";
        if (karma >= 200) return "CONTRIBUTEUR";
        if (karma >= 50)  return "ACTIF";
        return "DEBUTANT";
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(
                u.getId(),
                u.getNom(),
                u.getPrenom(),
                u.getEmail(),
                u.getKarma(),
                u.getRole().name(),
                u.getFiliere(),
                u.getNiveau()
        );
    }
}