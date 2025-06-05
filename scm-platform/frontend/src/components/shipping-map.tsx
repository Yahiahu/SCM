"use client";

import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.75rem", // rounded-xl
};

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

interface ShipmentMarker {
  lat: number;
  lng: number;
  label: string;
  status?: "in-transit" | "delivered" | "pending";
  estimatedDelivery?: string;
}

export default function ShippingMap({ shipments = [] }: { shipments?: any[] }) {
  const [selectedMarker, setSelectedMarker] = useState<ShipmentMarker | null>(
    null
  );
  const [mapLoaded, setMapLoaded] = useState(false);

  // Enhanced markers with status and delivery info
  const markers: ShipmentMarker[] = [
    {
      lat: 40.7128,
      lng: -74.006,
      label: "New York",
      status: "in-transit",
      estimatedDelivery: "2023-12-15",
    },
    {
      lat: 34.0522,
      lng: -118.2437,
      label: "Los Angeles",
      status: "delivered",
      estimatedDelivery: "2023-12-10",
    },
    {
      lat: 41.8781,
      lng: -87.6298,
      label: "Chicago",
      status: "pending",
      estimatedDelivery: "2023-12-20",
    },
    {
      lat: 25.7617,
      lng: -80.1918,
      label: "Miami",
      status: "in-transit",
      estimatedDelivery: "2023-12-18",
    },
    {
      lat: 47.6062,
      lng: -122.3321,
      label: "Seattle",
      status: "in-transit",
      estimatedDelivery: "2023-12-22",
    },
  ];

  const getMarkerColor = (status: string | undefined) => {
    switch (status) {
      case "delivered":
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      case "in-transit":
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      case "pending":
        return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      default:
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        onLoad={() => setMapLoaded(true)}
        loadingElement={
          <div className="h-full w-full flex items-center justify-center">
            Loading map...
          </div>
        }
      >
        {mapLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={4}
            options={{
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
              disableDefaultUI: true,
              zoomControl: true,
              streetViewControl: true,
            }}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: getMarkerColor(marker.status),
                  scaledSize: new window.google.maps.Size(32, 32),
                }}
                onClick={() => setSelectedMarker(marker)}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold text-lg">{selectedMarker.label}</h3>
                  <div
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedMarker.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : selectedMarker.status === "in-transit"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedMarker.status?.replace("-", " ") ||
                      "Unknown status"}
                  </div>
                  {selectedMarker.estimatedDelivery && (
                    <p className="text-sm mt-1">
                      Est. delivery: {selectedMarker.estimatedDelivery}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </LoadScript>

      {/* Legend */}

      </div>

  );
}
