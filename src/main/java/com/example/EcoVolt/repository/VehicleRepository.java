package com.example.EcoVolt.repository;

import com.example.EcoVolt.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    List<Vehicle> findByVehicleType(String vehicleType);
    List<Vehicle> findByBatteryLevelGreaterThan(int level);
}