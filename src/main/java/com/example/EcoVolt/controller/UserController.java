package com.example.EcoVolt.controller;

import com.example.EcoVolt.model.User;
import com.example.EcoVolt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        // Check if user already exists
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User loginDetails) {
        Optional<User> user = userRepository.findByEmail(loginDetails.getEmail());
        
        if(user.isPresent() && user.get().getPassword().equals(loginDetails.getPassword())) {
            return user.get(); // Login success
        } else {
            throw new RuntimeException("Invalid email or password");
        }
    }
}