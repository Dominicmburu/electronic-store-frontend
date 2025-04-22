import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, DataTable, StatusBadge, ConfirmationModal } from './common';
import { useProducts } from './Context/useProducts';
import styles from '../../styles/pages/Products.module.css';

const Products: React.FC = () => {
  const { products, isLoading, deleteProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const columns = [
    { field: 'image', header: 'Image', render: (product: any) => (
      <img 
        src={product.imageUrl || '/assets/placeholder-product.png'} 
        alt={product.name} 
        className={styles.productImage} 
      />
    )},
    { field: 'name', header: 'Product Name', sortable: true },
    { field: 'category', header: 'Category', render: (product: any) => (
      <span>{product.category?.name || 'Uncategorized'}</span>
    )},
    { field: 'printerType', header: 'Printer Type', render: (product: any) => (
      <span>{product.printerType?.name || 'N/A'}</span>
    )},
    { field: 'price', header: 'Price', render: (product: any) => (
      <span>KES {product.price.toLocaleString()}</span>
    ), sortable: true },
    { field: 'stock', header: 'Stock', sortable: true },
    { field: 'status', header: 'Status', render: (product: any) => (
      <StatusBadge 
        status={product.status} 
        statusMap={{
          active: { label: 'Active', color: 'success' },
          inactive: { label: 'Inactive', color: 'danger' },
          'out-of-stock': { label: 'Out of Stock', color: 'warning' },
        }} 
      />
    )},
    { field: 'actions', header: 'Actions', render: (product: any) => (
      <div className={styles.actionButtons}>
        <Link to={`/products/edit/${product.id}`} className={styles.editButton}>
          <span className="material-icons">edit</span>
        </Link>
        <button 
          className={styles.deleteButton}
          onClick={() => handleDeleteClick(product.id)}
        >
          <span className="material-icons">delete</span>
        </button>
      </div>
    )},
  ];
  
  const handleDeleteClick = (productId: string) => {
    setSelectedProduct(productId);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct);
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };
  
  return (
    <div className={styles.productsContainer}>
      <PageHeader 
        title="Products" 
        subtitle="Manage your printer products" 
        actions={
          <Link to="/products/add" className={styles.addButton}>
            <span className="material-icons">add</span>
            Add New Product
          </Link>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={products || []} 
        isLoading={isLoading} 
        pagination={true}
        searchable={true}
        searchFields={['name', 'description', 'category.name', 'printerType.name']}
      />
      
      <ConfirmationModal 
        isOpen={showDeleteModal}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default Products;