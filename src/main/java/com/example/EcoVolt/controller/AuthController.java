package com.example.EcoVolt.controller;

import com.example.EcoVolt.model.User;
import com.example.EcoVolt.repository.UserRepository;
import com.example.EcoVolt.util.JwtUtil;
import com.example.EcoVolt.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager; // Handles the login check

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil; // Generates the Key

    @Autowired
    private UserRepository userRepository;

    // 1. SIGN UP (No Change)
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already registered!");
        }
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // 2. LOGIN (Major Update: Now returns a Token!)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) throws Exception {
        try {
            // A. Authenticate the user (Checks email & password)
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Incorrect username or password");
        }

        // B. If Auth successful, generate the Token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        // C. Fetch the full User object to send back name/role
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();

        // D. Send both Token and User Info back to React
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }
}