package com.example.EcoVolt.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "vehicles")
public class Vehicle {
    @Id
    private String id;
    private String vehicleType;
    
    // Using Wrapper classes to handle nulls safely
    private Integer batteryLevel; 
    private Double maxRangeKm;
    private Double ratePerKm;

    // Standard Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }
    public Double getMaxRangeKm() { return maxRangeKm; }
    public void setMaxRangeKm(Double maxRangeKm) { this.maxRangeKm = maxRangeKm; }
    public Double getRatePerKm() { return ratePerKm; }
    public void setRatePerKm(Double ratePerKm) { this.ratePerKm = ratePerKm; }
}