package com.example.BankingSystem.Controller;


import com.example.BankingSystem.Dto.LoginRequest;
import com.example.BankingSystem.Dto.RegisterRequest;
import com.example.BankingSystem.Security.AuthServiceLayer;
import com.example.BankingSystem.Security.JWTService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthServiceLayer authServiceLayer;

    private final AuthenticationManager authenticationManager;

    private final JWTService jwtService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(Map.of(
                "message", authServiceLayer.register(request)
        ));
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        return jwtService.GenerateToken(request.getEmail());
    }

}
