import React from 'react';

export const LoadingState: React.FC = () => (
  <div className="d-flex justify-content-center my-5">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="alert alert-danger" role="alert">
    {error}
  </div>
);

export const EmptyState: React.FC = () => (
  <div className="alert alert-info" role="alert">
    No products found.
  </div>
);