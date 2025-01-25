import React, { useState, useRef, useMemo } from 'react';
import Layout from '../components/Layout';
import StoreList from '../components/shop_locations/StoreList';
import MapComponent from '../components/shop_locations/MapComponent';
import { stores, Store } from '../types/stores';
import debounce from 'lodash.debounce';

const StoreLocator: React.FC = () => {
  const [filteredStores, setFilteredStores] = useState<Store[]>(stores);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = stores.filter(store =>
      store.name.toLowerCase().includes(lowerCaseQuery) ||
      store.address.toLowerCase().includes(lowerCaseQuery) ||
      store.phone.toLowerCase().includes(lowerCaseQuery) ||
      store.email.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredStores(filtered);
  };

  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 300),
    []
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedHandleSearch(e.target.value);
  };

  const focusOnStore = (storeId: number) => {
    const store = stores.find(s => s.id === storeId);
    if (store && mapRef.current) {
      mapRef.current.setZoom(14);
      mapRef.current.panTo({ lat: store.lat, lng: store.lng });
    }
  };

  return (
    <Layout>
      <div className="container my-5">
        <h2 className="mb-4">Find Our Stores</h2>
        <div className="locator-container">
          <div className="row">
            {/* Map Section */}
            <div className="col-lg-8 mb-4">
              <MapComponent stores={filteredStores} mapRef={mapRef} />
            </div>
            {/* Store List Section */}
            <div className="col-lg-4">
              <div className="mb-3">
                <input
                  type="text"
                  id="store-search"
                  className="form-control"
                  placeholder="Search by city, state, or zip code"
                  onChange={onSearchChange}
                />
              </div>
              <StoreList stores={filteredStores} onFocusStore={focusOnStore} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StoreLocator;
