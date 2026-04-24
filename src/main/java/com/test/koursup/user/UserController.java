package com.test.koursup.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(new UserResponse(
                user.getId(),
                user.getNom(),
                user.getPrenom(),
                user.getEmail(),
                user.getKarma(),
                user.getRole().name(),
                user.getFiliere(),
                user.getNiveau()
        ));
    }

    @GetMapping("/classement")
    public ResponseEntity<List<UserResponse>> getClassement() {
        List<User> users = userRepository.findTop10ByOrderByKarmaDesc();
        List<UserResponse> classement = users.stream()
                .map(u -> new UserResponse(
                        u.getId(),
                        u.getNom(),
                        u.getPrenom(),
                        u.getEmail(),
                        u.getKarma(),
                        u.getRole().name(),
                        u.getFiliere(),
                        u.getNiveau()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(classement);
    }
}