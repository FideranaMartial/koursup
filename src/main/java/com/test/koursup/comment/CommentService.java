package com.test.koursup.comment;

import com.test.koursup.comment.dto.CommentResponse;
import com.test.koursup.document.Document;
import com.test.koursup.document.DocumentRepository;
import com.test.koursup.user.User;
import com.test.koursup.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public CommentResponse commenter(Long documentId,
                                     String contenu,
                                     String email) {
        User auteur = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

        Comment comment = Comment.builder()
                .contenu(contenu)
                .auteur(auteur)
                .document(document)
                .build();

        commentRepository.save(comment);

        // +2 karma pour un commentaire
        auteur.setKarma(auteur.getKarma() + 2);
        userRepository.save(auteur);

        return toResponse(comment);
    }

    public List<CommentResponse> getComments(Long documentId) {
        return commentRepository
                .findByDocumentIdOrderByCreatedAtDesc(documentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void supprimer(Long commentId, String email) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Commentaire non trouvé"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!comment.getAuteur().getId().equals(user.getId())) {
            throw new RuntimeException("Non autorisé");
        }

        // Retire le karma
        user.setKarma(Math.max(0, user.getKarma() - 2));
        userRepository.save(user);

        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment c) {
        return CommentResponse.builder()
                .id(c.getId())
                .contenu(c.getContenu())
                .auteurNom(c.getAuteur().getNom())
                .auteurPrenom(c.getAuteur().getPrenom())
                .auteurEmail(c.getAuteur().getEmail())
                .documentId(c.getDocument().getId())
                .createdAt(c.getCreatedAt())
                .build();
    }
}