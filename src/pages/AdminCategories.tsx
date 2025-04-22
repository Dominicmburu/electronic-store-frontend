// pages/categories/Categories.tsx
import React, { useState, useEffect } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import axios from 'axios';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/Admin/Categories.css';

interface PrinterType {
  id: number;
  name: string;
  printerCount: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  images: string[];
  printerTypeId: number;
  printerType?: PrinterType;
}

interface PaginatedCategories {
  page: number;
  totalPages: number;
  categories: Category[];
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [printerTypes, setPrinterTypes] = useState<PrinterType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [] as string[],
    printerTypeId: 0
  });

  // API URLs
  const API_BASE_URL = 'http://127.0.0.1:5000/api';
  const CATEGORIES_URL = `${API_BASE_URL}/categories`;
  const PRINTER_TYPES_URL = `${API_BASE_URL}/printer-types`;

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<PaginatedCategories>(`${CATEGORIES_URL}?page=${page}&limit=${limit}`);
      setCategories(response.data.categories);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrinterTypes = async () => {
    try {
      const response = await axios.get(`${PRINTER_TYPES_URL}`);
      // Make sure the response is an array
      const printerTypesData = Array.isArray(response.data) ? response.data : 
                             (response.data.printerTypes || []);
      setPrinterTypes(printerTypesData);
    } catch (error) {
      console.error('Error fetching printer types:', error);
      setPrinterTypes([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPrinterTypes();
  }, [page]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      images: [],
      printerTypeId: printerTypes && printerTypes.length > 0 ? printerTypes[0].id : 0
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'printerTypeId' ? parseInt(value, 10) : value
    });
  };

  const handleAddNew = () => {
    resetForm();
    setEditingCategory(null);
    setShowAddModal(true);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      images: category.images || [],
      printerTypeId: category.printerTypeId
    });
    setEditingCategory(category);
    setShowAddModal(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${CATEGORIES_URL}/${categoryId}`);
        fetchCategories(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting category:', error);
        setError('Failed to delete category. Please try again.');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real application, you would upload the file to your server
      // and then store the image URL or filename
      // For this example, we'll just store the filename
      const newImages = [...formData.images];
      newImages.push(e.target.files[0].name);
      setFormData({
        ...formData,
        images: newImages
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (editingCategory) {
        // Update existing category
        await axios.put(`${CATEGORIES_URL}/${editingCategory.id}`, formData);
      } else {
        // Add new category
        await axios.post(CATEGORIES_URL, formData);
      }
      
      setShowAddModal(false);
      fetchCategories(); // Refresh the list after adding/updating
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Failed to save category. Please check your inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading && categories.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="categories-container">
      <PageHeader 
        title="Categories" 
        subtitle="Manage your product categories"
        actions={
          <button className="btn btn-success" onClick={handleAddNew}>
            <FaPlus className="mr-1" /> Add Category
          </button>
        }
      />
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button type="button" className="close" onClick={() => setError(null)}>
            <span>&times;</span>
          </button>
        </div>
      )}
      
      <div className="row">
        <div className="col-12">
          <DashboardCard title='Categories List' className="mb-4">
            <div className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>

            {filteredCategories.length === 0 ? (
              <div className="text-center py-5">
                <i className="material-icons empty-icon">category</i>
                <h4>No categories found</h4>
                <p>Try adjusting your search or create a new category.</p>
                <button className="btn btn-primary mt-3" onClick={handleAddNew}>
                  <FaPlus className="mr-1" /> Add Category
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Printer Type</th>
                      <th>Images</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td><strong>{category.id}</strong></td>
                        <td>{category.name}</td>
                        <td className="category-description">{category.description}</td>
                        <td>{category.printerType?.name || 'Unknown'}</td>
                        <td>
                          {category.images && category.images.length > 0 ? (
                            <div className="image-thumbnails">
                              {category.images.map((image, index) => (
                                <div key={index} className="image-thumbnail">
                                  {image}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted">No images</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(category)}
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(category.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => changePage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => changePage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => changePage(page + 1)}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </DashboardCard>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="modal fade show" id="categoryModal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingCategory ? 'Edit Category' : 'Add New Category'}</h5>
                <button type="button" className="close" onClick={() => setShowAddModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="form-group">
                    <label>Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label>Printer Type</label>
                    <select
                      className="form-control"
                      name="printerTypeId"
                      value={formData.printerTypeId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a printer type</option>
                      {Array.isArray(printerTypes) && printerTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Images</label>
                    <div className="custom-file mb-2">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="categoryImage"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                      <label className="custom-file-label" htmlFor="categoryImage">
                        Choose image...
                      </label>
                    </div>
                    
                    {/* Image Preview */}
                    {formData.images.length > 0 && (
                      <div className="image-previews mt-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="image-preview-item">
                            <div className="image-name">{image}</div>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => removeImage(index)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowAddModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Add Category')}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default Categories;