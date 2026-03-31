package com.example.BankingSystem.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("JWT FILTER HIT");

        String authHeader = request.getHeader("Authorization");

        // ✅ Step 1: Check header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("INVALID HEADER");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // ✅ Step 2: Extract token
            String token = authHeader.substring(7);
            System.out.println("TOKEN: " + token);

            // ✅ Step 3: Extract email
            String email = jwtService.extractEmail(token);
            System.out.println("EMAIL: " + email);

            // ✅ Step 4: Set authentication
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                var userDetails = userDetailsService.loadUserByUsername(email);

                System.out.println("AUTHORITIES: " + userDetails.getAuthorities());

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities() // 🔥 VERY IMPORTANT
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);

                System.out.println("AUTH SET SUCCESS");
            }

        } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getMessage());
        }

        // ✅ Step 5: Continue filter chain
        filterChain.doFilter(request, response);
    }
}