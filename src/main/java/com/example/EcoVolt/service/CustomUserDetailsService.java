package com.example.EcoVolt.service;

import com.example.EcoVolt.model.User;
import com.example.EcoVolt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Find User in DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 2. DEBUG PRINT: Check your server console when you login!
        System.out.println("🔍 Found User: " + user.getName() + " | DB Role: " + user.getRole());

        // 3. Convert String Role to Authority
        // Ensure we handle nulls safely and default to USER
        String roleName = (user.getRole() != null) ? user.getRole().toUpperCase() : "USER";
        
        // Spring Security usually expects roles to prevent access issues
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(roleName));

        // 4. Return the User with Authorities
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities // <--- THIS is what gives permission!
        );
    }
}