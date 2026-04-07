package com.test.koursup.document;

import com.test.koursup.document.dto.DocumentRequest;
import com.test.koursup.document.dto.DocumentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponse> upload(
            @RequestPart("metadata") DocumentRequest request,
            @RequestPart("fichier") MultipartFile fichier,
            Authentication auth) throws IOException {
        return ResponseEntity.ok(
                documentService.upload(request, fichier, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<Page<DocumentResponse>> listerTous(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(documentService.listerTous(page, size));
    }

    @GetMapping("/recherche")
    public ResponseEntity<Page<DocumentResponse>> rechercher(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(documentService.rechercher(keyword, page, size));
    }

    @GetMapping("/filiere/{filiere}")
    public ResponseEntity<Page<DocumentResponse>> parFiliere(
            @PathVariable String filiere,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                documentService.filtrerParFiliere(filiere, page, size));
    }

    @GetMapping("/filiere/{filiere}/niveau/{niveau}")
    public ResponseEntity<Page<DocumentResponse>> parFiliereEtNiveau(
            @PathVariable String filiere,
            @PathVariable String niveau,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                documentService.filtrerParFiliereEtNiveau(
                        filiere, niveau, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getById(id));
    }

    @GetMapping("/{id}/telecharger")
    public ResponseEntity<Resource> telecharger(
            @PathVariable Long id) throws MalformedURLException {
        Path path = documentService.telecharger(id);
        Resource resource = new UrlResource(path.toUri());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                path.getFileName().toString() + "\"")
                .body(resource);
    }

    @GetMapping("/mes-documents")
    public ResponseEntity<List<DocumentResponse>> mesDocuments(
            Authentication auth) {
        return ResponseEntity.ok(documentService.mesDocuments(auth.getName()));
    }

    @GetMapping("/top")
    public ResponseEntity<List<DocumentResponse>> topDocuments() {
        return ResponseEntity.ok(documentService.topDocuments());
    }

    @GetMapping("/filtrer")
    public ResponseEntity<Page<DocumentResponse>> filtrer(
            @RequestParam(required = false) String filiere,
            @RequestParam(required = false) String niveau,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                documentService.filtrer(filiere, niveau, type, page, size));
    }
}