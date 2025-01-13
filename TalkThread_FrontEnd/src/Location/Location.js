import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
// import './MapComponent.css'; // Custom CSS for styling
import { useLocation } from 'react-router-dom';
const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const location = useLocation();
  const {fridestination } = location.state || {};
  // Define the destination coordinates
  const destination = L.latLng(fridestination[0], fridestination[1]);
    console.log(fridestination);
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const initialMap = L.map(mapRef.current, {
        center: [17.196608008058988, 78.59761239847006], // Default location
        zoom: 18,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(initialMap);

      mapInstance.current = initialMap;
    }

    // Get user's location with higher accuracy
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
          setUserLocation(userLatLng);
          console.log(position.coords.latitude, position.coords.longitude)
          if (mapInstance.current) {
            // Create custom SVG icons for markers
            const userIcon = L.divIcon({
              html: `
                <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#2196F3" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="5" fill="white"/>
                </svg>
              `,
              className: '',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            });

            const friendIcon = L.divIcon({
              html: `
                <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                        fill="#FF5722" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="9" r="3" fill="white"/>
                </svg>
              `,
              className: '',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            });

            // Add the user's location marker
            L.marker(userLatLng, { icon: userIcon, draggable: false })
              .addTo(mapInstance.current)
              .bindPopup('You')
              .openPopup();

            // Add a marker for the destination
            L.marker(destination, { icon: friendIcon, draggable: false })
              .addTo(mapInstance.current)
              .bindPopup('Your Friend')
              .openPopup();

            // Create a routing control
            L.Routing.control({
              waypoints: [userLatLng, destination],
              routeWhileDragging: false,
              createMarker: () => null,
            }).addTo(mapInstance.current);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
        {
          enableHighAccuracy: true,  // Request higher accuracy (GPS)
          timeout: 10000,            // Set a timeout (in milliseconds)
          maximumAge: 0,             // Don't use a cached position
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []); // Empty dependency array to run effect only once when component mounts

  return (
    <div>
      <div ref={mapRef} style={{ height: '100dvh', width: '100dvw' }}></div>
    </div>
  );
};

export default MapComponent;