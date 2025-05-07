import React, { useState, useEffect, useContext } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import ProductService, { Product } from '../components/Admin/Services/ProductService';
import ProductForm from '../components/Admin/common/ProductForm';
import DeleteConfirmationModal from '../components/Admin/common/DeleteConfirmationModal';
import ProductViewModal from '../components/Admin/common/ProductViewModal';
import '../styles/Admin/Products.css';
import { API_BASE_URL } from '../api/main';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { AiFillAppstore, AiOutlineUnorderedList } from 'react-icons/ai';
import { MdDelete, MdEdit, MdStar, MdStarBorder, MdVisibility } from 'react-icons/md';
import { UserContext } from '../contexts/UserContext';
import { toast } from 'react-toastify';


const Products: React.FC = () => {
  const { token } = useContext(UserContext) || {};

  const [products, setProducts] = useState<(Product & { status?: 'active' | 'out_of_stock' })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showProductForm, setShowProductForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [productToView, setProductToView] = useState<Product | null>(null);
  const productsPerPage = 9;

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await ProductService.getAllProducts();

      const mappedProducts = data.map(product => ({
        ...product,
        status: getStatus(product.stockQuantity),
        category: product.category || 'Uncategorized'
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatus = (stockQuantity?: number): 'active' | 'out_of_stock' => {
    return stockQuantity && stockQuantity > 0 ? 'active' : 'out_of_stock';
  };

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setShowProductForm(true);
  };

  const handleViewProduct = (product: Product) => {
    setProductToView(product);
    setShowViewModal(true);
  };

  const handleDeleteClick = (productId: number) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete === null) return;
  
    try {
      setIsSubmitting(true);
      await ProductService.deleteProduct(productToDelete, token as string);
      setProducts(products.filter(product => product.id !== productToDelete));
      setShowDeleteModal(false);
      setProductToDelete(null);
      toast.success('Product deleted successfully!');
    } catch (error: any) {
      console.error('Delete Product Error:', error);
      
      // Handle different error scenarios with appropriate toast messages
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
        
        // Check for specific error messages and show appropriate toasts
        if (errorMessage.includes('shopping carts')) {
          toast.warning('This product is currently in shopping carts and cannot be deleted. Please consider marking it as out of stock.');
        } else if (errorMessage.includes('completed orders')) {
          toast.info('This product is associated with completed orders and cannot be deleted for record-keeping purposes. You can mark it as out of stock instead.');
        } else if (errorMessage.includes('referenced') || errorMessage.includes('violates foreign key')) {
          toast.error('This product is referenced by other data and cannot be deleted.');
        } else {
          // Generic error messages
          toast.error(errorMessage);
        }
        
        setErrorMessage(errorMessage);
      } else {
        // Default error message
        const defaultMessage = 'Failed to delete product. Please try again.';
        toast.error(defaultMessage);
        setErrorMessage(defaultMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const updatedProduct = await ProductService.updateFeaturedStatus(
        product.id,
        !product.isFeatured,
        token as string
      );

      if (!updatedProduct || updatedProduct.isFeatured === undefined) {
        throw new Error('Invalid response from updateFeaturedStatus');
      }

      setProducts(products.map(p =>
        p.id === product.id ? { ...p, isFeatured: updatedProduct.isFeatured } : p
      ));
    } catch (error) {
      console.error('Error updating featured status:', error);
      setErrorMessage('Failed to update featured status. Please try again.');
    }
  };

  // const handleProductSubmit = async (productData: any) => {
  //   try {
  //     setIsSubmitting(true);
  //     let updatedProduct: Product;

  //     const formData = new FormData();

  //     // Basic product information
  //     formData.append('name', productData.name.toString());
  //     formData.append('description', productData.description.toString());
  //     formData.append('lastPrice', productData.lastPrice.toString());
  //     formData.append('currentPrice', productData.currentPrice.toString());
  //     formData.append('stockQuantity', productData.stockQuantity.toString());
  //     formData.append('categoryId', productData.categoryId.toString());
  //     formData.append('isFeatured', productData.isFeatured.toString());

  //     // Handle specifications properly
  //     // The backend expects specifications as an object, but formData can't directly accept objects
  //     // We can either stringify the entire object, or send it in a format that the backend can parse
  //     // formData.append('specifications', JSON.stringify(productData.specifications || {}));
  //     Object.entries(productData.specifications || {}).forEach(([key, value]) => {
  //       formData.append(`specifications[${key}]`, String(value));
  //     });
  //     // Handle existing images - these should be sent as a string array that the backend can merge
  //     // Don't try to create File objects from strings as this won't work
  //     if (productData.images && productData.images.length > 0) {
  //       productData.images.forEach((image: string) => {
  //         const file = new File([image], image, { type: "image/jpeg" });
  //         formData.append('images[]', file);
  //       });
  //     }

  //     // Handle new uploaded image files properly
  //     if (productData.newImages && productData.newImages.length > 0) {
  //       productData.newImages.forEach((file: File) => {
  //         // Use the field name 'images' as expected by multer in the backend
  //         formData.append('images', file);
  //       });
  //     }

  //     if (currentProduct) {
  //       updatedProduct = await ProductService.updateProduct(currentProduct.id, formData, token as string);
  //       setProducts(products.map(p =>
  //         p.id === currentProduct.id ? { ...updatedProduct, status: getStatus(updatedProduct.stockQuantity) } : p
  //       ));
  //       toast.success('Product updated successfully!');
  //     } else {
  //       // Create new product
  //       updatedProduct = await ProductService.createProduct(formData, token as string);
  //       setProducts([
  //         ...products,
  //         { ...updatedProduct, status: getStatus(updatedProduct.stockQuantity) }
  //       ]);
  //       toast.success('Product created successfully!');
  //     }

  //     setShowProductForm(false);
  //     setCurrentProduct(null);
  //   } catch (error) {
  //     console.error('Error saving product:', error);
  //     setErrorMessage('Failed to save product. Please check your inputs and try again.');
  //     toast.error('Error saving product. Please try again!');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleProductSubmit = async (productData: FormData | any) => {
    try {
      setIsSubmitting(true);
      let updatedProduct: Product;
  
      if (productData instanceof FormData) {
        // If productData is already FormData, use it directly
        if (currentProduct) {
          updatedProduct = await ProductService.updateProduct(currentProduct.id, productData, token as string);
          setProducts(products.map(p =>
            p.id === currentProduct.id ? { ...updatedProduct, status: getStatus(updatedProduct.stockQuantity) } : p
          ));
          toast.success('Product updated successfully!');
        } else {
          // Create new product
          updatedProduct = await ProductService.createProduct(productData, token as string);
          setProducts([
            ...products,
            { ...updatedProduct, status: getStatus(updatedProduct.stockQuantity) }
          ]);
          toast.success('Product created successfully!');
        }
      } else {
        // If not FormData, create it here
        const formData = new FormData();
  
        // Add basic product information
        formData.append('name', productData.name.toString());
        formData.append('description', productData.description.toString());
        formData.append('lastPrice', productData.lastPrice.toString());
        formData.append('currentPrice', productData.currentPrice.toString());
        formData.append('stockQuantity', productData.stockQuantity.toString());
        formData.append('categoryId', productData.categoryId.toString());
        formData.append('isFeatured', productData.isFeatured.toString());
  
        // Handle specifications
        formData.append('specifications', JSON.stringify(productData.specifications || {}));
  
        // Handle existing images
        if (productData.images && productData.images.length > 0) {
          formData.append('existingImages', JSON.stringify(productData.images));
        }
  
        // Handle new images
        if (productData.newImages && productData.newImages.length > 0) {
          productData.newImages.forEach((file: File) => {
            formData.append('images', file);
          });
        }
  
        if (currentProduct) {
          updatedProduct = await ProductService.updateProduct(currentProduct.id, formData, token as string);
          setProducts(products.map(p =>
            p.id === currentProduct.id ? { ...updatedProduct, status: getStatus(updatedProduct.stockQuantity) } : p
          ));
          toast.success('Product updated successfully!');
        } else {
          // Create new product
          updatedProduct = await ProductService.createProduct(formData, token as string);
          setProducts([
            ...products,
            { ...updatedProduct, status: getStatus(updatedProduct.stockQuantity) }
          ]);
          toast.success('Product created successfully!');
        }
      }
  
      setShowProductForm(false);
      setCurrentProduct(null);
    } catch (error: any) {
      console.error('Error saving product:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setErrorMessage('Failed to save product. Please check your inputs and try again.');
        toast.error('Error saving product. Please try again!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-secondary';
      case 'out_of_stock': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'out_of_stock': return 'Out of Stock';
      default: return status || 'Unknown';
    }
  };

  const categories = ['all', ...new Set(products.map(product => product.category || 'Uncategorized'))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(product.id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;

    return matchesSearch && matchesCategory;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (!token) {
    return <div className="alert alert-warning">You must be logged in to manage products.</div>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const getImageUrl = (imageName: string) => {
    return imageName.startsWith('http')
      ? imageName
      : `${API_BASE_URL}/uploads/${imageName}`;
  };

  return (
    <div className="products-container">
      <PageHeader
        title="Products"
        subtitle="Manage your product inventory"
        actions={
          <div className="d-flex">
            <button className="btn btn-success" onClick={handleAddProduct}>
              <FaPlus className="mr-1" /> Add Product
            </button>
          </div>
        }
      />

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button type="button" className="close" onClick={() => setErrorMessage(null)}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      <DashboardCard title='Product List' className="mb-4">
        <div className="product-filters mb-4">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <i className="material-icons">search</i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-md-end">
                <div className="d-flex align-items-center">
                  <label className="mr-2 mb-0">Category:</label>
                  <select
                    className="form-control form-control-sm mr-3"
                    value={currentCategory}
                    onChange={(e) => {
                      setCurrentCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>

                  <div className="btn-group view-toggle">
                    <button
                      className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <AiFillAppstore className="mr-1" />
                    </button>
                    <button
                      className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <AiOutlineUnorderedList className="mr-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentProducts.length === 0 ? (
          <div className="text-center py-5">
            <i className="material-icons empty-icon">inventory</i>
            <h4>No products found</h4>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="row">
                {currentProducts.map((product) => (
                  <div key={product.id} className="col-xl-4 col-md-6 mb-4">
                    <div className="card product-card h-100">
                      <div className="product-image-container">
                        <img
                          src={product.images && product.images.length > 0
                            ? getImageUrl(product.images[0])
                            : '/assets/placeholder-image.jpg'}
                          className="card-img-top product-image"
                          alt={product.name}
                        />
                        {product.isFeatured && <span className="featured-badge">Featured</span>}
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text product-category">{product.category || 'Uncategorized'}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="product-price">KES {product.currentPrice.toLocaleString()}</span>
                          <span className={`badge ${getStatusBadgeClass(product.status)}`}>
                            {getStatusLabel(product.status)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            <strong>Stock:</strong> {product.stockQuantity || 0} units
                          </small>
                        </div>
                      </div>
                      <div className="card-footer bg-transparent">
                        <div className="btn-group w-100">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewProduct(product)}
                          >
                            <FaEye className="mr-1" /> View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleEditProduct(product)}
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(product.id)}
                          >
                            <FaTrash className="mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Quantity</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product) => (
                      <tr key={product.id}>
                        <td><strong>{product.id}</strong></td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={product.images && product.images.length > 0
                                ? getImageUrl(product.images[0])
                                : '/assets/placeholder-image.jpg'}
                              alt={product.name}
                              className="product-thumbnail mr-2"
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.category || 'Uncategorized'}</td>
                        <td>KES {product.currentPrice.toLocaleString()}</td>
                        <td>{product.stockQuantity || 0}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(product.status)}`}>
                            {getStatusLabel(product.status)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-link p-0"
                            onClick={() => handleToggleFeatured(product)}
                          >
                            {product.isFeatured ? (
                              <MdStar className="text-warning" />
                            ) : (
                              <MdStarBorder className="text-muted" />
                            )}
                          </button>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewProduct(product)}
                            >
                              <MdVisibility />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleEditProduct(product)}
                            >
                              <MdEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteClick(product.id)}
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </div>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage > 3 ?
                    (currentPage + i > totalPages ? totalPages - 4 + i : currentPage - 2 + i) :
                    i + 1;

                  if (pageNum <= totalPages && pageNum > 0) {
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => paginate(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  }
                  return null;
                })}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </DashboardCard>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={currentProduct}
          onSubmit={handleProductSubmit}
          onCancel={() => setShowProductForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}
          isDeleting={isSubmitting}
        />
      )}

      {/* Product View Modal */}
      {showViewModal && productToView && (
        <ProductViewModal
          product={productToView}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default Products;