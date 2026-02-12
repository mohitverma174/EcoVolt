package com.example.EcoVolt.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime; // ✅ Import this

@Document(collection = "rides")
public class Ride {
    @Id
    private String id;
    
    private String passengerEmail;
    private String driverName;
    private String driverEmail;
    
    // 👇 NEW FIELDS REQUIRED BY YOUR SERVICE
    private String vehicleId;
    private LocalDateTime bookingTime; 

    private String source;
    private String destination;
    private String vehicleType;
    private boolean isCarpool;
    private double price;
    private String status;

    public Ride() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getPassengerEmail() { return passengerEmail; }
    public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    
    public String getDriverEmail() { return driverEmail; }
    public void setDriverEmail(String driverEmail) { this.driverEmail = driverEmail; }

    // ✅ Fixes "ride.setVehicleId" error
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    // ✅ Fixes "ride.setBookingTime" error
    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public boolean isCarpool() { return isCarpool; }
    public void setCarpool(boolean carpool) { isCarpool = carpool; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}