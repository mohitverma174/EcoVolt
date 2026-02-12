package com.example.EcoVolt.repository;

import com.example.EcoVolt.model.Ride;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RideRepository extends MongoRepository<Ride, String> {
    List<Ride> findByPassengerEmail(String email);
    List<Ride> findByDriverEmail(String email);
}