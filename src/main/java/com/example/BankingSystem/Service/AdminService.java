package com.example.BankingSystem.Service;

import com.example.BankingSystem.Entity.Account;
import com.example.BankingSystem.Entity.Status;
import com.example.BankingSystem.Entity.User;
import com.example.BankingSystem.Repository.AccountRepository;
import com.example.BankingSystem.Repository.UserRepository;
import com.example.BankingSystem.Util.AccountNumberGenerator;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
@AllArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public List<User> GetPendingUsers() {
        return userRepository.findByStatus(Status.PENDING);
    }

    public String approveUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        user.setStatus(Status.APPROVED);
        userRepository.save(user);

        // Create Account
        Account account = new Account();

        account.setUser(user);
        account.setBalance(0.0);
        account.setAccountNumber(AccountNumberGenerator.generate());

        accountRepository.save(account);

        return "User approved and Account Created";
    }

    public String rejectUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        user.setStatus(Status.REJECTED);
        userRepository.save(user);
        return "User rejected";
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
