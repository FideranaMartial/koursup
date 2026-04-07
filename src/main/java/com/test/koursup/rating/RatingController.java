package com.test.koursup.rating;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/{documentId}/noter")
    public ResponseEntity<String> noter(
            @PathVariable Long documentId,
            @RequestParam int note,
            Authentication auth) {
        ratingService.noter(documentId, note, auth.getName());
        return ResponseEntity.ok("Note enregistrée !");
    }

    @GetMapping("/{documentId}/ma-note")
    public ResponseEntity<Integer> getMaNote(
            @PathVariable Long documentId,
            Authentication auth) {
        return ResponseEntity.ok(
                ratingService.getMaNote(documentId, auth.getName()));
    }
}