package com.example.BankingSystem.Util;

import java.util.Random;

public class AccountNumberGenerator {

    public static String generate() {
        Random random = new Random();
        return "Acc" + (100000 + random.nextInt(900000));
    }
}
