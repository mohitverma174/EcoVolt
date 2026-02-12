package com.example.EcoVolt.controller;

import com.example.EcoVolt.model.User;
import com.example.EcoVolt.repository.UserRepository;
import com.example.EcoVolt.util.JwtUtil;
import com.example.EcoVolt.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// 1. Allow React to talk to this controller
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    // --- SIGNUP ---
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }
        // Encrypt Password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Default Role
        if (user.getRole() == null) user.setRole("PASSENGER");
        user.setRole(user.getRole().toUpperCase());

        userRepository.save(user);
        return "User Registered Successfully!";
    }

    // --- LOGIN (SAFE MODE) ---
    @PostMapping("/login")
    public Map<String, Object> createAuthenticationToken(@RequestBody User user) throws Exception {
        System.out.println("🛑 LOGIN ATTEMPT: " + user.getEmail());

        try {
            // 1. Check User/Pass
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );
        } catch (BadCredentialsException e) {
            System.out.println("❌ Wrong Password");
            throw new Exception("Incorrect username or password", e);
        }

        // 2. Load User Details safely
        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        
        // 3. Generate Token (With Error Handling)
        String jwt = null;
        try {
            // Ensure this matches your JwtUtil method signature!
            jwt = jwtUtil.generateToken(userDetails.getUsername());
        } catch (Exception e) {
            System.out.println("❌ JWT Generation Failed: " + e.getMessage());
            e.printStackTrace(); // PRINT THE ERROR
            throw new Exception("Error generating token: " + e.getMessage());
        }

        // 4. Get User Data safely
        User dbUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new Exception("User found in Auth but not in DB? This should never happen."));

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("name", dbUser.getName());
        response.put("role", dbUser.getRole());

        System.out.println("✅ Login Successful. Token sent.");
        return response;
    }
}