// pages/categories/Categories.tsx
import React, { useState, useEffect, useContext } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import axios from 'axios';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/Admin/Categories.css';
import { API_BASE_URL } from '../api/main';
import { UserContext } from '../contexts/UserContext';
import { toast } from 'react-toastify';

interface PrinterType {
  id: number;
  name: string;
  printerCount: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  printerTypeId: number;
  printerType?: PrinterType;
}

interface PaginatedCategories {
  page: number;
  totalPages: number;
  categories: Category[];
}

const Categories: React.FC = () => {
  const { token } = useContext(UserContext) || {};
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
  

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    printerTypeId: 0
  });

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
  }, [page, token]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
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
      printerTypeId: category.printerTypeId
    });
    setEditingCategory(category);
    setShowAddModal(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${CATEGORIES_URL}/${categoryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchCategories(); 
        toast.success('Category deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting category:', error);
        let errorMessage = 'Failed to delete category. Please try again.';
        
        // Check if error contains a message from the server
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        
        setError(errorMessage);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (editingCategory) {
        await axios.put(`${CATEGORIES_URL}/${editingCategory.id}`, formData,
          { headers: { Authorization: `Bearer ${token}` } }          
        );
        toast.success('Category updated successfully!');
      } else {
        await axios.post(CATEGORIES_URL, formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Category added successfully!');
      }
      
      setShowAddModal(false);
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      let errorMessage = 'Failed to save category. Please check your inputs and try again.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
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