// src/components/shop_locations/MapComponent.tsx

import React, { useEffect } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';
import { Store } from '../../types/stores';
import { useState } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '4px',
  overflow: 'hidden'
};

const center: [number, number] = [
  -0.023559, // Geographical center of Kenya
  37.906193,
];

interface MapComponentProps {
  stores: Store[];
  mapRef: React.MutableRefObject<any>;
}

const MapComponent: React.FC<MapComponentProps> = ({ stores, mapRef }) => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [zoom, setZoom] = useState(6);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  // Save map methods to the ref
  const handleMapCreated = () => {
    mapRef.current = {
      setView: (coords: [number, number], newZoom: number) => {
        setMapCenter(coords);
        setZoom(newZoom);
      }
    };
  };

  useEffect(() => {
    handleMapCreated();
  }, []);

  return (
    <div style={mapContainerStyle}>
      <Map
        height={400}
        center={mapCenter}
        zoom={zoom}
        onBoundsChanged={({ center, zoom }) => {
          setMapCenter([center[0], center[1]]);
          setZoom(zoom);
        }}
      >
        {stores.map(store => (
          <Marker
            key={store.id}
            width={40}
            anchor={[store.lat, store.lng]}
            color="#3498db"
            onClick={() => setSelectedStore(store)}
          />
        ))}

        {selectedStore && (
          <Overlay 
            anchor={[selectedStore.lat, selectedStore.lng]} 
            offset={[120, 79]}
          >
            <div style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '4px',
              boxShadow: '0 2px 7px rgba(0,0,0,0.1)',
              width: '240px',
              position: 'relative'
            }}>
              <button 
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onClick={() => setSelectedStore(null)}
              >
                ×
              </button>
              <h5 style={{ marginTop: '0', marginBottom: '8px' }}>{selectedStore.name}</h5>
              <p style={{ margin: '5px 0' }}><strong>Address:</strong> {selectedStore.address}</p>
              <p style={{ margin: '5px 0' }}><strong>Phone:</strong> <a href={`tel:${selectedStore.phone}`}>{selectedStore.phone}</a></p>
              <p style={{ margin: '5px 0' }}><strong>Email:</strong> <a href={`mailto:${selectedStore.email}`}>{selectedStore.email}</a></p>
              <p style={{ margin: '5px 0' }}><strong>Hours:</strong> {selectedStore.hours}</p>
            </div>
          </Overlay>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;