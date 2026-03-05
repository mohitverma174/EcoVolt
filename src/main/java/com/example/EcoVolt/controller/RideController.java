package com.example.EcoVolt.controller;

import com.example.EcoVolt.model.Ride;
import com.example.EcoVolt.model.Vehicle;
import com.example.EcoVolt.repository.RideRepository;
import com.example.EcoVolt.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    // ✅ NEW: Payment Endpoint
    @PutMapping("/{rideId}/pay")
    public ResponseEntity<?> payForRide(@PathVariable String rideId) {
        return rideRepository.findById(rideId).map(ride -> {
            
            // 1. Mark ride as paid
            ride.setStatus("PAID");
            Ride updatedRide = rideRepository.save(ride);

            // 2. FREE THE VEHICLE (Find the vehicle and make it AVAILABLE again)
            List<Vehicle> vehicles = vehicleRepository.findByDriverEmail(ride.getDriverEmail());
            if (!vehicles.isEmpty()) {
                Vehicle v = vehicles.get(0);
                v.setStatus("AVAILABLE");
                vehicleRepository.save(v);
            }

            return ResponseEntity.ok(updatedRide);
        }).orElseThrow(() -> new RuntimeException("Ride not found"));
    }

   @PostMapping("/book")
    public ResponseEntity<?> bookRide(@RequestBody Ride rideRequest) {
        
        // 1. Detect if this is a Carpool request
        String requestedType = rideRequest.getVehicleType();
        boolean isCarpool = false;
        String searchType = requestedType;

        if (requestedType != null && requestedType.endsWith("-POOL")) {
            isCarpool = true;
            searchType = requestedType.replace("-POOL", ""); // Convert "E-CAR-POOL" back to "E-CAR"
        }

        // 2. Search for an AVAILABLE vehicle using the base type (e.g., E-CAR)
        List<Vehicle> availableVehicles = vehicleRepository
            .findByCurrentLocationIgnoreCaseAndVehicleTypeIgnoreCaseAndStatusIgnoreCase(
                rideRequest.getSource(), 
                searchType, 
                "AVAILABLE"
            );

        if (availableVehicles.isEmpty()) {
            return ResponseEntity.status(404).body("Sorry, no " + searchType + "s are currently available in " + rideRequest.getSource());
        }

        // 3. Assign the vehicle
        Vehicle assignedVehicle = availableVehicles.get(0);

        rideRequest.setDriverEmail(assignedVehicle.getDriverEmail());
        rideRequest.setDriverName(assignedVehicle.getDriverName());
        rideRequest.setVehicleNumber(assignedVehicle.getVehicleNumber());
        rideRequest.setVehicleId(assignedVehicle.getId());
        rideRequest.setStatus("ACCEPTED");
        rideRequest.setBookingTime(java.time.LocalDateTime.now());
        
        // 4. 💸 Apply Pricing Logic (Discount for Carpool!)
        if (isCarpool) {
            rideRequest.setPrice(90.0); // 40% discount for sharing!
            rideRequest.setVehicleType(searchType + " (Shared)"); // Make it look nice on UI
        } else {
            rideRequest.setPrice(150.0); // Standard full price
            rideRequest.setVehicleType(searchType); 
        }

        // 5. Lock the vehicle
        assignedVehicle.setStatus("BUSY");
        vehicleRepository.save(assignedVehicle);

        // 6. Save the ride
        Ride savedRide = rideRepository.save(rideRequest);

        return ResponseEntity.ok(savedRide);
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
    // ✅ ADD THIS METHOD: Get rides for a specific passenger
    @GetMapping("/passenger/{email}")
    public List<Ride> getPassengerRides(@PathVariable String email) {
        return rideRepository.findByPassengerEmail(email);
    }

    // 2. Update Ride Status (Accept, Start, Complete)
    @PutMapping("/{id}/status")
    public Ride updateRideStatus(@PathVariable String id, @RequestParam String status) {
        Ride ride = rideRepository.findById(id).orElseThrow(() -> new RuntimeException("Ride not found"));
        ride.setStatus(status.toUpperCase());
        return rideRepository.save(ride);
    }
    // 🏁 NEW: Driver completes the ride
   @PutMapping("/{rideId}/complete")
    public ResponseEntity<?> completeRide(@PathVariable String rideId) {
        return rideRepository.findById(rideId).map(ride -> {
            
            ride.setStatus("COMPLETED");
            
            // Only set default price IF it wasn't already set during booking
            if (ride.getPrice() == null || ride.getPrice() == 0.0) {
                ride.setPrice(150.0); 
            }
            
            Ride updatedRide = rideRepository.save(ride);
            return ResponseEntity.ok(updatedRide);

        }).orElseThrow(() -> new RuntimeException("Ride not found"));
    }
}