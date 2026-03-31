package com.example.BankingSystem.Security;

import com.example.BankingSystem.Dto.RegisterRequest;
import com.example.BankingSystem.Entity.Role;
import com.example.BankingSystem.Entity.Status;
import com.example.BankingSystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.BankingSystem.Entity.User;

@Service
@RequiredArgsConstructor
public class AuthServiceLayer {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public String register(RegisterRequest request) {

        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already registered!";
        }

        // New User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setStatus(Status.PENDING);

        userRepository.save(user);

        return "User registered Successfully. Kindly Wait for approval";

    }


}
