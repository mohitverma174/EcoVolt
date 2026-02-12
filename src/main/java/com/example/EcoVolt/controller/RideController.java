package com.example.EcoVolt.controller;

import com.example.EcoVolt.model.Ride;
import com.example.EcoVolt.model.Vehicle;
import com.example.EcoVolt.repository.RideRepository;
import com.example.EcoVolt.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "http://localhost:5173")
public class RideController {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private VehicleRepository vehicleRepository; // ✅ We now talk to the Vehicles Table

    @PostMapping("/book")
    public Ride bookRide(@RequestBody Ride rideRequest) {
        
        System.out.println("--- 🔍 DEBUG START ---");
        System.out.println("Looking for: City=" + rideRequest.getSource() + ", Type=" + rideRequest.getVehicleType());

        // 1. PRINT ALL VEHICLES IN DB (To see what exists)
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        System.out.println("Total Vehicles in DB: " + allVehicles.size());
        
        for (Vehicle v : allVehicles) {
            System.out.println(" -> Found Car: [Location='" + v.getCurrentLocation() + "', Type='" + v.getVehicleType() + "']");
        }
        System.out.println("----------------------");

        // 2. FIND THE MATCH
        Vehicle assignedVehicle = allVehicles.stream()
                .filter(v -> v.getCurrentLocation() != null && v.getCurrentLocation().trim().equalsIgnoreCase(rideRequest.getSource().trim())) // Added .trim() to fix spaces!
                .filter(v -> v.getVehicleType() != null && v.getVehicleType().equalsIgnoreCase(rideRequest.getVehicleType()))
                .findFirst()
                .orElse(null);

        // ... rest of your code (Logic 2: Assign Driver) ...
        if (assignedVehicle != null) {
             System.out.println("✅ MATCH FOUND! Vehicle ID: " + assignedVehicle.getId());
             rideRequest.setDriverEmail(assignedVehicle.getDriverEmail());
             rideRequest.setDriverName("Verified Driver");
             rideRequest.setVehicleId(assignedVehicle.getId());
             
             // Price Logic
             double rate = (assignedVehicle.getRatePerKm() != null) ? assignedVehicle.getRatePerKm() : 15.0;
             rideRequest.setPrice(10.0 * rate); // Mock distance
             rideRequest.setStatus("BOOKED");
        } else {
             System.out.println("❌ NO MATCH. Assigning Bot.");
             rideRequest.setDriverName("EcoVolt Bot");
             rideRequest.setDriverEmail("bot@ecovolt.com");
             rideRequest.setPrice(50.0);
             rideRequest.setStatus("WAITING");
        }

        return rideRepository.save(rideRequest);
    }
    
    @GetMapping("/user/{email}")
    public List<Ride> getUserRides(@PathVariable String email) {
        return rideRepository.findByPassengerEmail(email);
    }
    // 1. Get Rides Assigned to a Specific Driver
    @GetMapping("/driver/{email}")
    public List<Ride> getDriverRides(@PathVariable String email) {
        return rideRepository.findByDriverEmail(email);
    }

    // 2. Update Ride Status (Accept, Start, Complete)
    @PutMapping("/{id}/status")
    public Ride updateRideStatus(@PathVariable String id, @RequestParam String status) {
        Ride ride = rideRepository.findById(id).orElseThrow(() -> new RuntimeException("Ride not found"));
        ride.setStatus(status.toUpperCase());
        return rideRepository.save(ride);
    }
}