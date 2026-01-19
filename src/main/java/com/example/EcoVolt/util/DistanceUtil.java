package com.example.EcoVolt.util;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component
public class DistanceUtil {

    // 1. Store Coordinates of popular cities (Add more as you like!)
    private static final Map<String, double[]> cityCoordinates = new HashMap<>();

    static {
        // Format: { Latitude, Longitude }
        cityCoordinates.put("INDORE", new double[]{22.7196, 75.8577});
        cityCoordinates.put("UJJAIN", new double[]{23.1765, 75.7819});
        cityCoordinates.put("BHOPAL", new double[]{23.2599, 77.4126});
        cityCoordinates.put("DEWAS", new double[]{22.9676, 76.0534});
        cityCoordinates.put("MUMBAI", new double[]{19.0760, 72.8777});
        cityCoordinates.put("PUNE", new double[]{18.5204, 73.8567});
    }

    // 2. The "Haversine" Formula to calculate distance between two points
    public double calculateDistance(String source, String destination) {
        // Convert to uppercase to match our map keys
        String src = source.toUpperCase().trim();
        String dest = destination.toUpperCase().trim();

        if (!cityCoordinates.containsKey(src) || !cityCoordinates.containsKey(dest)) {
            // Fallback: If city not found, generate a random realistic distance (for demo)
            return 15.0 + (Math.random() * 20); 
        }

        double[] point1 = cityCoordinates.get(src);
        double[] point2 = cityCoordinates.get(dest);

        return getDistanceFromLatLonInKm(point1[0], point1[1], point2[0], point2[1]);
    }

    private double getDistanceFromLatLonInKm(double lat1, double lon1, double lat2, double lon2) {
        int R = 6371; // Radius of the earth in km
        double dLat = deg2rad(lat2 - lat1);
        double dLon = deg2rad(lon2 - lon1);
        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    private double deg2rad(double deg) {
        return deg * (Math.PI / 180);
    }
}