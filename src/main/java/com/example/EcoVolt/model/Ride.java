package com.example.EcoVolt.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "rides")
public class Ride {
    @Id
    private String id;
    
    // This was likely missing or named 'passengerName' before
    private String userName; 
    
    private String source;
    private String destination;
    private Double price;
    private String status;      // e.g., "BOOKED", "COMPLETED"
    private LocalDateTime bookingTime;
    private String vehicleId;   // To link with the driver

    // Constructors
    public Ride() {}

    public Ride(String userName, String source, String destination, Double price, String status) {
        this.userName = userName;
        this.source = source;
        this.destination = destination;
        this.price = price;
        this.status = status;
        this.bookingTime = LocalDateTime.now();
    }

    // Getters and Setters (This is what fixed your error)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
}