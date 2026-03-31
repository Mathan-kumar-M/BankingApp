package com.example.BankingSystem.Dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@RequiredArgsConstructor
public class TransactionResponse {

    private String type;
    private Double amount;
    private String status;
    private LocalDateTime timestamp;
    private String direction;

    // getters & setters
}