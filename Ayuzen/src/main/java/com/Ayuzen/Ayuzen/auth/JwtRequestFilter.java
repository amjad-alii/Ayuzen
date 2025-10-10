package com.Ayuzen.Ayuzen.auth;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        System.out.println("--- [JwtRequestFilter] Processing request for: " + request.getRequestURI());

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.getUsernameFromToken(jwt);
                System.out.println("--- [JwtRequestFilter] Token found. Username from token: " + username);
            } catch (Exception e) {
                System.out.println("--- [JwtRequestFilter] ERROR: Could not parse JWT token. " + e.getMessage());
            }
        } else {
            System.out.println("--- [JwtRequestFilter] No 'Bearer ' token found in header.");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("--- [JwtRequestFilter] Security context is empty. Loading UserDetails...");
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                System.out.println("--- [JwtRequestFilter] Token is VALID. Setting security context.");
                System.out.println("--- [JwtRequestFilter] User authorities: " + userDetails.getAuthorities());

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("--- [JwtRequestFilter] Token is INVALID.");
            }
        } else {
            System.out.println("--- [JwtRequestFilter] Username is null or security context is not empty.");
        }

        chain.doFilter(request, response);
    }
}