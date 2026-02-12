package com.example.EcoVolt.repository;

import com.example.EcoVolt.model.Vehicle;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    
    // Standard methods
    List<Vehicle> findByVehicleType(String vehicleType);
    List<Vehicle> findByBatteryLevelGreaterThan(int level);

    // ✅ THIS IS THE METHOD YOU WERE MISSING
    @Aggregation(pipeline = { "{ '$group': { '_id': '$currentLocation' } }" })
    List<String> findDistinctCurrentLocation();
}