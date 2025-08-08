package com.anagha.staffclientservice.auth;

import com.anagha.staffclientservice.admin.Player;
import com.anagha.staffclientservice.admin.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private PlayerRepository playerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public String login(@RequestBody Player request) {
        System.out.println("AuthController login -----");
        System.out.println("Login attempt for user: " + request.getUsername());
        System.out.println("Password from frontend: " + request.getPassword());
        return playerRepository.findByUsername(request.getUsername())
                .map(player -> {
                	System.out.println("Stored password in DB: " + player.getPassword());
                	if (!passwordEncoder.matches(request.getPassword(), player.getPassword())) {
                		System.out.println("Password from frontend: " + request.getPassword());
                		System.out.println("Password from backend: " + player.getPassword());
                		System.out.println("Password from frontend (hashed now): " + passwordEncoder.encode(request.getPassword()));
                        System.out.println("Password mismatch detected!");
                        return "Invalid password";
                    }
                    if (!player.getRole().equalsIgnoreCase(request.getRole())) {
                        return "Invalid role";
                    }
                    return "Login successful for role: " + player.getRole();
                })
                .orElse("User not found");
    }
}
