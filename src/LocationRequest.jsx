import React, { useState, useEffect } from "react";
import axios from "axios";

const LocationRequest = () => {
  const [location, setLocation] = useState(null);
  const [nearestAirport, setNearestAirport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          findNearestAirport(latitude, longitude);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const findNearestAirport = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            format: 'json',
            zoom: 10, // Level of detail for search results
          }
        }
      );

      const airport = response?.data.name || 'No airport nearby found';
      setNearestAirport(airport);
    } catch (error) {
      setError('Error fetching nearest airport');
      // console.error(error);
    }
  };

  return (
    <>
    </>
  );
};

export default LocationRequest;
