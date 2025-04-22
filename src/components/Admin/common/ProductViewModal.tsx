import React, { useState } from 'react';
import { Product } from '../Services/ProductService';
import ProductReviews from './ProductReviews';
import { API_BASE_URL } from '../../../api/main';
import '../../../styles/Admin/ProductViewModal.css';

interface ProductViewModalProps {
  product: Product;
  onClose: () => void;
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({ product, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [activeImage, setActiveImage] = useState<string | null>(
    product.images && product.images.length > 0 ? product.images[0] : null
  );

  const getImageUrl = (imageName: string) => {
    return imageName.startsWith('http')
      ? imageName
      : `${API_BASE_URL}/uploads/${imageName}`;
  };

  const handleReviewDeleted = () => {
    // This function would be triggered after a review is deleted
    // We could show a success message or trigger other updates
    console.log('Review deleted successfully');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Product Details</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          
          <div className="modal-body">
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </li>
            </ul>
            
            {activeTab === 'details' ? (
              <div className="row">
                <div className="col-md-6">
                  {/* Main product image */}
                  <div className="product-main-image mb-3">
                    {activeImage ? (
                      <img
                        src={getImageUrl(activeImage)}
                        alt={product.name}
                        className="img-fluid"
                      />
                    ) : (
                      <div className="no-image-placeholder">
                        <i className="material-icons">image</i>
                        <p>No image available</p>
                      </div>
                    )}
                  </div>

                  {/* Image thumbnails */}
                  {product.images && product.images.length > 1 && (
                    <div className="product-thumbnails">
                      {product.images.map((image, index) => (
                        <div
                          key={index}
                          className={`thumbnail-wrapper ${image === activeImage ? 'active' : ''}`}
                          onClick={() => setActiveImage(image)}
                        >
                          <img
                            src={getImageUrl(image)}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            className="img-thumbnail"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <h3 className="product-title">{product.name}</h3>
                  
                  {product.isFeatured && (
                    <span className="badge badge-warning mb-2">Featured</span>
                  )}
                  
                  <div className="product-pricing mb-3">
                    <div className="current-price">KES {product.currentPrice.toLocaleString()}</div>
                    {product.lastPrice > product.currentPrice && (
                      <div className="original-price">KES {product.lastPrice.toLocaleString()}</div>
                    )}
                  </div>
                  
                  <div className="product-details mb-3">
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{product.category || 'Uncategorized'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Stock:</span>
                      <span className="detail-value">
                        {product.stockQuantity || 0} units
                        {product.stockQuantity === 0 && (
                          <span className="badge badge-danger ml-2">Out of Stock</span>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="product-description mb-4">
                    <h5>Description</h5>
                    <p>{product.description}</p>
                  </div>
                  
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="product-specifications">
                      <h5>Specifications</h5>
                      <table className="table table-sm table-bordered">
                        <tbody>
                          {Object.entries(product.specifications).map(([key, value], index) => (
                            <tr key={index}>
                              <th>{key}</th>
                              <td>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <ProductReviews 
                productId={product.id} 
                onDeleteSuccess={handleReviewDeleted}
              />
            )}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;