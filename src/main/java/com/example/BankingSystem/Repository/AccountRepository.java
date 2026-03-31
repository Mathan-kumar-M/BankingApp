package com.example.BankingSystem.Repository;

import com.example.BankingSystem.Entity.Account;
import com.example.BankingSystem.Entity.Status;
import com.example.BankingSystem.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Account findByUser(User user);

    Account findByAccountNumber(String accountNumber);
}
