package com.example.EcoVolt.repository;

import com.example.EcoVolt.model.Ride;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RideRepository extends MongoRepository<Ride, String> {
    
    // Finds rides going to the same place that are still just "BOOKED" (waiting)
    List<Ride> findBySourceAndDestinationAndStatus(String source, String destination, String status);
    List<Ride> findByVehicleId(String vehicleId);
}