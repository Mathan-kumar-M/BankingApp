package com.example.BankingSystem.Repository;

import com.example.BankingSystem.Entity.Account;
import com.example.BankingSystem.Entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderAccountOrReceiverAccountOrderByTimestampDesc(
            Account sender, Account receiver);
}
