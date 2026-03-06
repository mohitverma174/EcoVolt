import axios from 'axios';

const API_URL = 'https://ecovolt-r0js.onrender.com/api';

export const bookRide = async (rideData, distance, type) => {
    // Matches your Controller: POST /api/rides/book?distance=...&type=...
    return await axios.post(`${API_URL}/rides/book`, rideData, {
        params: {
            distance: distance,
            type: type
        }
    });
};