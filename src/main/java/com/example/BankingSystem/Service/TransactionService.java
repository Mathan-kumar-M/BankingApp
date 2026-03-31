package com.example.BankingSystem.Service;

import com.example.BankingSystem.Dto.TransactionResponse;
import com.example.BankingSystem.Entity.*;
import com.example.BankingSystem.Exception.InsuficientBalanceException;
import com.example.BankingSystem.Exception.UnauthorizedException;
import com.example.BankingSystem.Exception.UserNotApprovedException;
import com.example.BankingSystem.Repository.AccountRepository;
import com.example.BankingSystem.Repository.TransactionRepository;
import com.example.BankingSystem.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    // -- Common Validation --
    private void validateUser(Account account) {

        User user = account.getUser();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        // FIXED CONDITION
        if (!user.getEmail().equals(email)) {
            throw new UnauthorizedException("Unauthorized access");
        }

        if (user.getStatus() != Status.APPROVED) {
            throw new UserNotApprovedException("User not approved for Transactions");
        }
    }

    // --Deposit--
    @Transactional
    public String deposit(Long account_id, Double amount) {

        if (amount <= 0) {
            throw new InsuficientBalanceException("Amount must be greater than zero");
        }

        Account account = accountRepository.findById(account_id)
                .orElseThrow(() -> new RuntimeException("Account not found!"));

        validateUser(account);

        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.DEPOSIT);
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setReceiverAccount(account);

        transactionRepository.save(transaction);

        return "Deposit Successfully Completed!";
    }

    // -- Withdraw --
    @Transactional
    public String withdraw(Long account_id, Double amount) {

        if (amount <= 0) {
            throw new RuntimeException("Amount must be greater than Zero!");
        }

        Account account = accountRepository.findById(account_id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateUser(account);

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient Balance");
        }

        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.WITHDRAW);
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setSenderAccount(account);

        transactionRepository.save(transaction);

        return "Withdraw Successfully Completed!";
    }

    // ===================== TRANSFER =====================
    @Transactional
    public String transfer(Long senderId, String receiverAccountNumber, Double amount) {

        if (amount <= 0) {
            throw new RuntimeException("Amount must be greater than zero");
        }

        Account sender = accountRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        Account receiver = accountRepository.findByAccountNumber(receiverAccountNumber);
        if (receiver == null) {
            throw new RuntimeException("Receiver account not found");
        }

        if (sender.getId() == receiver.getId()) {
            throw new RuntimeException("Sender and receiver cannot be same");
        }

        validateUser(sender);

        if (sender.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        // Deduct from sender
        sender.setBalance(sender.getBalance() - amount);

        // Add to receiver
        receiver.setBalance(receiver.getBalance() + amount);

        accountRepository.save(sender);
        accountRepository.save(receiver);

        Transaction txn = new Transaction();
        txn.setType(TransactionType.TRANSFER);
        txn.setAmount(amount);
        txn.setTimestamp(LocalDateTime.now());
        txn.setStatus(TransactionStatus.SUCCESS);
        txn.setSenderAccount(sender);
        txn.setReceiverAccount(receiver);

        transactionRepository.save(txn);

        return "Transfer successful";
    }

    public List<TransactionResponse> getUserTransactions() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = Optional.ofNullable(accountRepository.findByUser(user))
                .orElseThrow(() -> new RuntimeException("Account not found"));

        List<Transaction> transactions = transactionRepository
                .findBySenderAccountOrReceiverAccountOrderByTimestampDesc(account, account);

        return transactions.stream()
                .map(t -> convertToDTO(t, account))
                .toList();
    }

    private TransactionResponse convertToDTO(Transaction t, Account userAccount) {

        TransactionResponse dto = new TransactionResponse();

        dto.setType(t.getType().name());
        dto.setAmount(t.getAmount());
        dto.setStatus(t.getStatus().name());
        dto.setTimestamp(t.getTimestamp());

        if (t.getSenderAccount() != null &&
                t.getSenderAccount().getId() == userAccount.getId()) {

            dto.setDirection("SENT");

        } else {
            dto.setDirection("RECEIVED");
        }

        return dto;
    }
}
