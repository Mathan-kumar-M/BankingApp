package com.example.BankingSystem.Controller;

import com.example.BankingSystem.Entity.Account;
import com.example.BankingSystem.Entity.User;
import com.example.BankingSystem.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    @GetMapping("/accounts")
    public ResponseEntity<Account> getUserAccount() {
        return ResponseEntity.ok(userService.getUserAccount());
    }
}
