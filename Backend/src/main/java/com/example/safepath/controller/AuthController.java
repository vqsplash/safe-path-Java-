package com.example.safepath.controller;

import com.example.safepath.dto.UserLoginDto;
import com.example.safepath.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto dto) {
        return authService.login(dto.getUsername(), dto.getPassword())
                .map(token -> ResponseEntity.ok(Map.of("success", true, "token", token.getToken())))
                .orElse(ResponseEntity.status(401).body(Map.of("success", false, "error", "Invalid Credentials")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Token ")) {
            String tokenStr = authHeader.substring(6);
            authService.logout(tokenStr);
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Logged out successfully"));
    }

   
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserLoginDto dto) {
        boolean created = authService.registerUser(dto.getUsername(), dto.getPassword());
        if (!created) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "Username already taken"));
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "User created successfully"));
    }
}
