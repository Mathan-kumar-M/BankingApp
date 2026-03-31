package com.example.BankingSystem.Exception;

public class InsuficientBalanceException extends RuntimeException{

    public InsuficientBalanceException(String message) {
        super(message);
    }
}
