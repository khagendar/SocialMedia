import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Routes/AuthContex";

export default function Location() {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);
    const auth=useAuth();
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setLocation(coords); // Set location
                    setError(null); // Clear any previous errors
                },
                (error) => {
                    setError("Unable to retrieve location.");
                    console.error(error);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    // Send location to server whenever location state is updated
    useEffect(() => {
        if (location.latitude && location.longitude) {
            sendLocationToServer(location);
        }
    }, [location]); // Dependency array includes location

    // Function to send location to the backend
    const sendLocationToServer = async (coords) => {
        try {
            const res= await axios.put(`http://localhost:5000/sign/Location/${auth?.user?._id}`,
                {
                    longitude: coords.longitude,
                    latitude: coords.latitude,
                }
            );
            console.log(res.data);
            console.log("Location saved successfully!");
        } catch (error) {
            console.error("Error saving location:", error);
            setError("Failed to save location.");
        }
    };

    // Automatically retrieve location on mount
    useEffect(() => {
        getLocation();
    }, []);

    return (
        <Box>
            <Typography variant="h5">Location</Typography>
            {location.latitude && location.longitude ? (
                <Box mt={2}>
                    <Typography>Latitude: {location.latitude}</Typography>
                    <Typography>Longitude: {location.longitude}</Typography>
                </Box>
            ) : (
                <Typography mt={2}>{error || "Retrieving location..."}</Typography>
            )}
        </Box>
    );
}
