package com.example.EcoVolt.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "vehicles")
public class Vehicle {
    @Id
    private String id;
    
    private String vehicleNumber;
    private String vehicleType;
    
    // 👇 THIS WAS MISSING
    private String driverEmail; 
    
    private String currentLocation; 
    private Integer batteryLevel;   
    private Double maxRangeKm;     
    private Double ratePerKm;      

    public Vehicle() {}

    // --- Getters and Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    // ✅ This fixes the Red Line in VehicleController
    public String getDriverEmail() { return driverEmail; }
    public void setDriverEmail(String driverEmail) { this.driverEmail = driverEmail; }

    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }

    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }

    public Double getMaxRangeKm() { return maxRangeKm; }
    public void setMaxRangeKm(Double maxRangeKm) { this.maxRangeKm = maxRangeKm; }
    
    public Double getRatePerKm() { return ratePerKm; }
    public void setRatePerKm(Double ratePerKm) { this.ratePerKm = ratePerKm; }
}