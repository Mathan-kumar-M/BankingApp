package com.example.BankingSystem.Handler;

import com.example.BankingSystem.Exception.InsuficientBalanceException;
import com.example.BankingSystem.Exception.UnauthorizedException;
import com.example.BankingSystem.Exception.UserNotApprovedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private Map<String, Object> buildResponse(String message, HttpStatus status) {

        Map<String, Object> error = new HashMap<>();
        error.put("Timestamp", LocalTime.now());
        error.put("Status", status.value());
        error.put("Error", status.getReasonPhrase());
        error.put("Message", message);

        return error;
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<?> HandleUnauthorizedUsers (UnauthorizedException ex) {
        return new ResponseEntity<>(buildResponse(ex.getMessage(), HttpStatus.FORBIDDEN), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(InsuficientBalanceException.class)
    public ResponseEntity<?>  HandleInSufficientBalance (InsuficientBalanceException ex) {
        return new ResponseEntity<>(buildResponse(ex.getMessage(), HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(UserNotApprovedException.class)
    public ResponseEntity<?> HandleAuthorisation (UserNotApprovedException ex) {
        return new ResponseEntity<>(buildResponse(ex.getMessage(), HttpStatus.FORBIDDEN), HttpStatus.FORBIDDEN);
    }

}
