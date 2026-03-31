package com.example.BankingSystem.Repository;

import com.example.BankingSystem.Entity.Account;
import com.example.BankingSystem.Entity.Status;
import com.example.BankingSystem.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional <User> findByEmail(String email);



    List<User> findByStatus(Status status);

}
