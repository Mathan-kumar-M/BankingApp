package com.example.BankingSystem.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RouteController {

    @GetMapping(value = {"/", "/login", "/dashboard", "/admin"})
    public String forward() {
        return "forward:/index.html";
    }
}
