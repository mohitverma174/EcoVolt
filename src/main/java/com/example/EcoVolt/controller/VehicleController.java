package com.example.EcoVolt.controller;

import com.example.EcoVolt.model.Vehicle;
import com.example.EcoVolt.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {


    // 1. GET ALL VEHICLES
    @Autowired
    private VehicleRepository vehicleRepository;

    // ✅ ADD THIS: Check if a driver already has a registered vehicle
    @GetMapping("/driver/{email}")
    public ResponseEntity<?> getVehicleByDriver(@PathVariable String email) {
        List<Vehicle> vehicles = vehicleRepository.findByDriverEmail(email);
        if (vehicles.isEmpty()) {
            return ResponseEntity.status(404).body("No vehicle found");
        }
        return ResponseEntity.ok(vehicles.get(0));
    }
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    // ✅ Add this endpoint to fetch the list of cities
    @GetMapping("/locations")
    public List<String> getLocations() {
        return vehicleRepository.findDistinctCurrentLocation();
    }
    

    // 2. REGISTER A NEW VEHICLE (Updated for Smart Booking)
    @PostMapping("/register") // ✅ Matches the previous instruction
    public ResponseEntity<Vehicle> registerVehicle(@RequestBody Vehicle vehicle) {
        
        // 🛡️ Set Defaults so the RideService can find this car
        if (vehicle.getCurrentLocation() == null) vehicle.setCurrentLocation("INDORE");
        if (vehicle.getBatteryLevel() == null) vehicle.setBatteryLevel(100);
        if (vehicle.getMaxRangeKm() == null) vehicle.setMaxRangeKm(150.0);
        
        // Default Rates based on Type
        if (vehicle.getRatePerKm() == null) {
            if ("E-BIKE".equalsIgnoreCase(vehicle.getVehicleType())) {
                vehicle.setRatePerKm(5.0);
            } else if ("E-RICKSHAW".equalsIgnoreCase(vehicle.getVehicleType())) {
                vehicle.setRatePerKm(8.0);
            } else {
                vehicle.setRatePerKm(15.0); // E-CAR default
            }
        }

        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    // 3. LEGACY ADD (Kept for compatibility with your previous code)
    @PostMapping
    public ResponseEntity<Vehicle> addVehicle(@RequestBody Vehicle vehicle) {
        // Redirect to the smart register logic
        return registerVehicle(vehicle);
    }

    // 4. TEST ENDPOINT (E-RICKSHAW)
    @PostMapping("/add-test-vehicle")
    public ResponseEntity<Vehicle> addTestVehicle() {
        Vehicle v = new Vehicle();
        v.setVehicleType("E-RICKSHAW");
        v.setBatteryLevel(100);
        v.setMaxRangeKm(150.0);
        v.setRatePerKm(8.0);
        v.setCurrentLocation("INDORE"); // ✅ Added Location
        v.setDriverEmail("driver@gmail.com"); // ✅ Added Dummy Driver
        return ResponseEntity.ok(vehicleRepository.save(v));
    }
    
    // 5. TEST ENDPOINT (E-BIKE)
    @PostMapping("/add-ebike")
    public ResponseEntity<Vehicle> addTestEBike() {
        Vehicle v = new Vehicle();
        v.setVehicleType("E-BIKE");     
        v.setBatteryLevel(90);          
        v.setMaxRangeKm(60.0);          
        v.setRatePerKm(5.0);   
        v.setCurrentLocation("INDORE"); // ✅ Added Location
        v.setDriverEmail("biker@gmail.com"); // ✅ Added Dummy Driver
        return ResponseEntity.ok(vehicleRepository.save(v));
    }
}