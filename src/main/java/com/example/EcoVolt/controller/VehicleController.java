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

    @Autowired
    private VehicleRepository vehicleRepository;

    // 1. GET ALL VEHICLES
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // 2. REGISTER A NEW VEHICLE (The Dynamic Way)
    // This replaces your old 'createVehicle' method
    @PostMapping
    public ResponseEntity<Vehicle> addVehicle(@RequestBody Vehicle vehicle) {
        if (vehicle.getBatteryLevel() == null) vehicle.setBatteryLevel(100);
        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    // 3. TEST ENDPOINT (Optional - you can keep or delete this)
    @PostMapping("/add-test-vehicle")
    public ResponseEntity<Vehicle> addTestVehicle() {
        Vehicle v = new Vehicle();
        v.setVehicleType("E-RICKSHAW");
        v.setBatteryLevel(100);
        v.setMaxRangeKm(150.0);
        v.setRatePerKm(8.0);
        return ResponseEntity.ok(vehicleRepository.save(v));
    }
    
    // 4. TEST ENDPOINT E-BIKE (Optional)
    @PostMapping("/add-ebike")
    public ResponseEntity<Vehicle> addTestEBike() {
        Vehicle v = new Vehicle();
        v.setVehicleType("E-BIKE");     
        v.setBatteryLevel(90);          
        v.setMaxRangeKm(60.0);          
        v.setRatePerKm(5.0);            
        return ResponseEntity.ok(vehicleRepository.save(v));
    }
}