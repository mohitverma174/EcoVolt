package com.example.EcoVolt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

// This line disables the login screen so you can test freely
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class EcoVoltApplication {
    public static void main(String[] args) {
        SpringApplication.run(EcoVoltApplication.class, args);
    }
}