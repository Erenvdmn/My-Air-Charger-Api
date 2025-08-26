import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export async function getAddressFromCoordinates(lat, lng) {
    const apiKey =process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            return data.results[0].formatted_address;
        } else {
            console.error("Reverse geocoding failed: ", data.status);
            return null;
        }
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
    }
}



/*

export async function getCoordinatesFromAddress(address) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            return [location.lng, location.lat];
        } else {
            console.error("Geocoding failed: ", data.status);
            return null;
        }
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}

*/