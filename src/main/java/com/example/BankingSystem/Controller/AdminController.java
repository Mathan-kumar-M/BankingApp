package com.example.BankingSystem.Controller;

import com.example.BankingSystem.Entity.User;
import com.example.BankingSystem.Service.AdminService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/pending")
    public List<User> getPendingUsers() {
        return adminService.GetPendingUsers();
    }

    @PostMapping("/approve/{id}")
    public String approveUser(@PathVariable Long id) {
        return adminService.approveUser(id);
    }

    @PostMapping("/reject/{id}")
    public String rejectUser(@PathVariable Long id) {
        return adminService.rejectUser(id);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }
}
