package com.example.BankingSystem.Exception;

public class UserNotApprovedException  extends RuntimeException{

    public UserNotApprovedException(String message){
        super(message);
    }
}
