package com.test.koursup.rating;

import com.test.koursup.document.Document;
import com.test.koursup.document.DocumentRepository;
import com.test.koursup.user.User;
import com.test.koursup.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public void noter(Long documentId, int note, String email) {

        // 1. Vérifie que la note est entre 1 et 5
        if (note < 1 || note > 5) {
            throw new RuntimeException("La note doit être entre 1 et 5");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

        // 2. Vérifie si l'utilisateur a déjà noté ce document
        Rating rating = ratingRepository
                .findByUserIdAndDocumentId(user.getId(), documentId)
                .orElse(Rating.builder()
                        .user(user)
                        .document(document)
                        .build());

        // 3. Met à jour ou crée la note
        rating.setNote(note);
        ratingRepository.save(rating);

        // 4. Recalcule la moyenne et met à jour le document
        Double moyenne = ratingRepository.calculerMoyenne(documentId);
        int nombreNotes = ratingRepository.countByDocumentId(documentId);

        document.setNoteMoyenne(moyenne != null ? moyenne : 0.0);
        document.setNombreNotes(nombreNotes);
        documentRepository.save(document);
    }

    public int getMaNote(Long documentId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ratingRepository
                .findByUserIdAndDocumentId(user.getId(), documentId)
                .map(Rating::getNote)
                .orElse(0); // 0 = pas encore noté
    }
}