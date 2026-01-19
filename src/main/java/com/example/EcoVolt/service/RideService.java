package com.example.EcoVolt.service;
import com.example.EcoVolt.util.DistanceUtil;

import com.example.EcoVolt.model.Ride;
import com.example.EcoVolt.model.Vehicle;
import com.example.EcoVolt.repository.RideRepository;
import com.example.EcoVolt.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class RideService {

    @Autowired
    private RideRepository rideRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DistanceUtil distanceUtil;
    // Helper method for fixed rates (optional use)
    public double calculateFare(String type, double distance) {
        switch(type) {
            case "E-BIKE": return distance * 5;
            case "E-RICKSHAW": return distance * 8;
            default: return distance * 15; // E-CAR
        }
    }

    public Ride bookRide(Ride ride, String preferredType) {
        
        // 1. Auto-Calculate Distance
        double distanceKm = distanceUtil.calculateDistance(ride.getSource(), ride.getDestination());
        
        // 2. Find Vehicle (With NULL Safety Checks)
        Vehicle vehicle = vehicleRepository.findAll().stream()
            // SAFETY CHECK 1: Skip vehicles with no Type
            .filter(v -> v.getVehicleType() != null && v.getVehicleType().equalsIgnoreCase(preferredType))
            
            // SAFETY CHECK 2: Skip vehicles with no Battery or Range
            .filter(v -> v.getBatteryLevel() != null && v.getMaxRangeKm() != null)
            
            // Logic: Check if it has enough range
            .filter(v -> (v.getMaxRangeKm() * v.getBatteryLevel() / 100) > distanceKm)
            
            .findFirst()
            .orElse(null);

        if (vehicle == null) {
            throw new RuntimeException("No suitable vehicle found for " + String.format("%.2f", distanceKm) + " km. (Check Database Data)");
        }

        // 3. Set Price
        // Correct: Check 'vehicle' directly, not 'v'
        double rate = (vehicle.getRatePerKm() != null) ? vehicle.getRatePerKm() : 10.0;
        double totalFare = distanceKm * rate;

        ride.setPrice(totalFare);
        ride.setVehicleId(vehicle.getId());
        ride.setBookingTime(LocalDateTime.now());
        ride.setStatus("BOOKED");

        return rideRepository.save(ride);
    }
    
    public java.util.List<Ride> getAllRides() {
        return rideRepository.findAll();
    }
}