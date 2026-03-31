package com.example.BankingSystem.Service;

import com.example.BankingSystem.Entity.Account;
import com.example.BankingSystem.Entity.User;
import com.example.BankingSystem.Repository.AccountRepository;
import com.example.BankingSystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public User getProfile() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Account getUserAccount() {
        User user = getProfile();
        Account account = accountRepository.findByUser(user);
        if (account == null) {
            throw new RuntimeException("No account found for this user");
        }
        return account;
    }
}
