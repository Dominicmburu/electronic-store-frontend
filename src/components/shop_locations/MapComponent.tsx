// src/components/MapComponent.tsx

import React, { useRef, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Store } from '../../types/stores';
import { useState, useImperativeHandle, forwardRef } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: -0.023559, // Geographical center of Kenya
  lng: 37.906193,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

interface MapComponentProps {
  stores: Store[];
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

const MapComponent: React.FC<MapComponentProps> = ({ stores, mapRef }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your API key
  });

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, [mapRef]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={6}
      center={center}
      options={options}
      onLoad={onMapLoad}
    >
      {stores.map(store => (
        <Marker
          key={store.id}
          position={{ lat: store.lat, lng: store.lng }}
          onClick={() => {
            setSelectedStore(store);
          }}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        />
      ))}

      {selectedStore && (
        <InfoWindow
          position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
          onCloseClick={() => {
            setSelectedStore(null);
          }}
        >
          <div>
            <h5>{selectedStore.name}</h5>
            <p><strong>Address:</strong> {selectedStore.address}</p>
            <p><strong>Phone:</strong> <a href={`tel:${selectedStore.phone}`}>{selectedStore.phone}</a></p>
            <p><strong>Email:</strong> <a href={`mailto:${selectedStore.email}`}>{selectedStore.email}</a></p>
            <p><strong>Hours:</strong> {selectedStore.hours}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapComponent;
