package com.test.koursup.comment;

import com.test.koursup.comment.dto.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{documentId}/comments")
    public ResponseEntity<CommentResponse> commenter(
            @PathVariable Long documentId,
            @RequestParam String contenu,
            Authentication auth) {
        return ResponseEntity.ok(
                commentService.commenter(documentId, contenu, auth.getName()));
    }

    @GetMapping("/{documentId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable Long documentId) {
        return ResponseEntity.ok(commentService.getComments(documentId));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> supprimer(
            @PathVariable Long commentId,
            Authentication auth) {
        commentService.supprimer(commentId, auth.getName());
        return ResponseEntity.ok().build();
    }
}