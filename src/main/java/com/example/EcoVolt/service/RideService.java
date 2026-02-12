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
        
        // 1. Calculate Distance
        double distanceKm = distanceUtil.calculateDistance(ride.getSource(), ride.getDestination());
        
        // 2. Find a Matching Vehicle
        Vehicle vehicle = vehicleRepository.findAll().stream()
            // Rule 1: Must be the correct Type (Car/Bike)
            .filter(v -> v.getVehicleType() != null && v.getVehicleType().equalsIgnoreCase(preferredType))
            
            // Rule 2: Must be in the SAME CITY as the passenger (The New Logic!)
            .filter(v -> v.getCurrentLocation() != null && v.getCurrentLocation().equalsIgnoreCase(ride.getSource()))
            
            // Rule 3: Must have enough battery/range
            .filter(v -> v.getBatteryLevel() != null && v.getMaxRangeKm() != null)
            .filter(v -> (v.getMaxRangeKm() * v.getBatteryLevel() / 100) > distanceKm)
            
            .findFirst()
            .orElse(null);

        // 3. Handle "No Driver Found"
        if (vehicle == null) {
            throw new RuntimeException("No drivers available in " + ride.getSource() + " right now!");
        }

        // 4. Create Booking
        double rate = (vehicle.getRatePerKm() != null) ? vehicle.getRatePerKm() : 10.0;
        double totalFare = distanceKm * rate;

        ride.setPrice(totalFare);
        ride.setVehicleId(vehicle.getId());
       // ride.setDriverName(vehicle.getDriverName()); // Optional: Save driver name if you added it
        ride.setBookingTime(LocalDateTime.now());
        ride.setStatus("BOOKED");

        return rideRepository.save(ride);
    }
    
    public java.util.List<Ride> getAllRides() {
        return rideRepository.findAll();
    }
}