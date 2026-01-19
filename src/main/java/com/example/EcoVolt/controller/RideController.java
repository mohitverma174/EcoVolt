package com.example.EcoVolt.controller;

import com.example.EcoVolt.model.Ride;
import com.example.EcoVolt.service.RideService;
import com.example.EcoVolt.repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "http://localhost:5173")
public class RideController {

    @Autowired
    private RideService rideService;

    @Autowired
    private RideRepository rideRepository;

    // 1. HELPER CLASS: Captures the JSON from React
    // This maps exactly to the 'formData' in your BookingForm.jsx
    public static class BookingRequest {
        public String userName;
        public String source;
        public String destination;
        public String vehicleType;
    
    }

    // 2. BOOK RIDE ENDPOINT (Updated)
    @PostMapping("/book")
    public ResponseEntity<?> bookRide(@RequestBody BookingRequest request) {
        try {
            // Create the Ride object from the request
            Ride ride = new Ride();
            ride.setUserName(request.userName);
            ride.setSource(request.source);
            ride.setDestination(request.destination);

            // Pass everything to the Service
            Ride newRide = rideService.bookRide(ride, request.vehicleType);
            
            return ResponseEntity.ok(newRide);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. GET ALL RIDES (For History)
    @GetMapping("/all")
    public List<Ride> getAllRides() {
        return rideService.getAllRides();
    }

    // 4. GET RIDES FOR DRIVER
    @GetMapping("/driver/{vehicleId}")
    public ResponseEntity<List<Ride>> getDriverRides(@PathVariable String vehicleId) {
        List<Ride> rides = rideRepository.findByVehicleId(vehicleId);
        return ResponseEntity.ok(rides);
    }

    // 5. COMPLETE RIDE
    @PutMapping("/complete/{rideId}")
    public ResponseEntity<Ride> completeRide(@PathVariable String rideId) {
        return rideRepository.findById(rideId)
            .map(ride -> {
                ride.setStatus("COMPLETED");
                return ResponseEntity.ok(rideRepository.save(ride));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}