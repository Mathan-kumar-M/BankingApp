package com.example.BankingSystem.Controller;

import com.example.BankingSystem.Dto.TransactionResponse;
import com.example.BankingSystem.Entity.Transaction;
import com.example.BankingSystem.Service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(@RequestParam Long accountId,
            @RequestParam Double amount) {
        return ResponseEntity.ok(transactionService.deposit(accountId, amount));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@RequestParam Long accountId,
            @RequestParam Double amount) {
        return ResponseEntity.ok(transactionService.withdraw(accountId, amount));
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestParam Long senderId,
            @RequestParam String receiverAccountNumber,
            @RequestParam Double amount) {
        return ResponseEntity.ok(transactionService.transfer(senderId, receiverAccountNumber, amount));
    }

    @GetMapping("/view")
    public ResponseEntity<List<TransactionResponse>> viewTransactions() {
        return ResponseEntity.ok(transactionService.getUserTransactions());
    }
}
