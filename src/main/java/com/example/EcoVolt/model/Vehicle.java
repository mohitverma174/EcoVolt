package com.example.EcoVolt.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "vehicles")
public class Vehicle {
    @Id
    private String id;
    
    private String vehicleType;
    private String vehicleNumber;
    private String driverEmail;
    private String driverName;
    private String currentLocation;
    
    // ✅ Changed to Objects (Double, Integer) to fix the '!= null' errors
    private Double ratePerKm;
    private Integer batteryLevel = 100;
    private Double maxRangeKm; 
    
    private String status = "AVAILABLE"; 

    // --- GETTERS AND SETTERS ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getDriverEmail() { return driverEmail; }
    public void setDriverEmail(String driverEmail) { this.driverEmail = driverEmail; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }

    public Double getRatePerKm() { return ratePerKm; }
    public void setRatePerKm(Double ratePerKm) { this.ratePerKm = ratePerKm; }

    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }

    public Double getMaxRangeKm() { return maxRangeKm; }
    public void setMaxRangeKm(Double maxRangeKm) { this.maxRangeKm = maxRangeKm; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}