// src/components/StoreList.tsx

import React from 'react';
import { Store } from '../../types/stores';
import styles from '../../styles/StoreList.module.css';

interface StoreListProps {
  stores: Store[];
  onFocusStore: (storeId: number) => void;
}

const StoreList: React.FC<StoreListProps> = ({ stores, onFocusStore }) => {
  if (stores.length === 0) {
    return <p className="text-center">No stores found matching your search criteria.</p>;
  }

  return (
    <div className={`store-list ${styles.storeList}`}>
      {stores.map(store => (
        <div key={store.id} className={`store-item ${styles.storeItem}`}>
          <h5>{store.name}</h5>
          <p><strong>Address:</strong> {store.address}</p>
          <p><strong>Phone:</strong> <a href={`tel:${store.phone}`}>{store.phone}</a></p>
          <p><strong>Email:</strong> <a href={`mailto:${store.email}`}>{store.email}</a></p>
          <p><strong>Hours:</strong> {store.hours}</p>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onFocusStore(store.id)}
          >
            <i className="bi bi-geo-alt-fill"></i> View on Map
          </button>
        </div>
      ))}
    </div>
  );
};

export default StoreList;
