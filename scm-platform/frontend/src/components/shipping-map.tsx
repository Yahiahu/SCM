"use client";

import { Box } from "@chakra-ui/react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

export default function ShippingMap({ shipments }: { shipments: any[] }) {
  // In a real app, you would plot actual shipment locations
  const markers = [
    { lat: 40.7128, lng: -74.006, label: "New York" },
    { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
    { lat: 41.8781, lng: -87.6298, label: "Chicago" },
    { lat: 25.7617, lng: -80.1918, label: "Miami" },
    { lat: 47.6062, lng: -122.3321, label: "Seattle" },
  ];

  return (
    <Box w="100%" h="100%">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4}>
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              label={marker.label}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
}
