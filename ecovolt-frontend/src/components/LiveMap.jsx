import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons not showing in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom EV Car Icon (Green)
const evIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to dynamically update map center if we want to later
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

function LiveMap({ sourceCity }) {
    // Default coordinates set to Central India
    const defaultCenter = [22.7196, 75.8577]; 
    const defaultZoom = 13;

    // Generate some fake "Available EVs" nearby to make the app look alive
    const nearbyEVs = [
        { id: 1, pos: [22.7206, 75.8587], name: "E-Car (4 Seater) - 2 mins away" },
        { id: 2, pos: [22.7180, 75.8550], name: "E-Bike (1 Seater) - 4 mins away" },
        { id: 3, pos: [22.7220, 75.8600], name: "E-Rickshaw - 1 min away" }
    ];

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: '100%', width: '100%' }}>
                <ChangeView center={defaultCenter} zoom={defaultZoom} />
                
                {/* Free OpenStreetMap Tiles */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* You are here marker */}
                <Marker position={defaultCenter}>
                    <Popup>
                        <strong>📍 Your Location</strong> <br/> Ready to book!
                    </Popup>
                </Marker>

                {/* Nearby EV markers */}
                {nearbyEVs.map(ev => (
                    <Marker key={ev.id} position={ev.pos} icon={evIcon}>
                        <Popup>
                            <strong>🔋 Available</strong> <br/> {ev.name}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default LiveMap;