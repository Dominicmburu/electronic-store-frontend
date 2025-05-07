import React, { useState, useEffect, useContext } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import axios from 'axios';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaChevronUp, FaChevronDown, FaCheck } from 'react-icons/fa';
import '../styles/Admin/PrinterTypes.css';
import { API_BASE_URL } from '../api/main';
import { UserContext } from '../contexts/UserContext';
import { toast } from 'react-toastify';

interface PrinterType {
  id: number;
  name: string;
  printerCount?: number;
}

const PrinterTypes: React.FC = () => {
  const { token } = useContext(UserContext) || {};
  const [printerTypes, setPrinterTypes] = useState<PrinterType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingType, setEditingType] = useState<PrinterType | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: ''
  });

  // API URLs
  const PRINTER_TYPES_URL = `${API_BASE_URL}/printer-types`;

  const fetchPrinterTypes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(PRINTER_TYPES_URL);
      // Make sure the response is an array
      const printerTypesData = Array.isArray(response.data) ? response.data : 
                             (response.data.printerTypes || []);
      setPrinterTypes(printerTypesData);
    } catch (error) {
      console.error('Error fetching printer types:', error);
      setError('Failed to fetch printer types. Please try again.');
      setPrinterTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrinterTypeDetails = async (id: number) => {
    try {
      const response = await axios.get(`${PRINTER_TYPES_URL}/${id}`);
      // Update the printer type in the list with the detailed information
      setPrinterTypes(printerTypes.map(type => 
        type.id === id ? { ...type, ...response.data } : type
      ));
    } catch (error) {
      console.error(`Error fetching details for printer type ${id}:`, error);
    }
  };

  useEffect(() => {
    fetchPrinterTypes();
  }, [token]);

  // When a printer type is expanded, fetch its details
  useEffect(() => {
    if (expandedId !== null) {
      fetchPrinterTypeDetails(expandedId);
    }
  }, [expandedId]);

  const filteredPrinterTypes = printerTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddNew = () => {
    setFormData({
      name: ''
    });
    setEditingType(null);
    setShowAddModal(true);
  };

  const handleEdit = (type: PrinterType) => {
    setFormData({
      name: type.name
    });
    setEditingType(type);
    setShowAddModal(true);
  };

  const handleDelete = async (typeId: number) => {
    if (window.confirm('Are you sure you want to delete this printer type?')) {
      try {
        await axios.delete(`${PRINTER_TYPES_URL}/${typeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchPrinterTypes(); 
        toast.success('Printer type deleted successfully!');
      } catch (error) {
        toast.error('Cannot delete Printer Type with associated categories');
        setError('Failed to delete printer type. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (editingType) {
        // Update existing printer type
        await axios.put(`${PRINTER_TYPES_URL}/${editingType.id}`, formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Printer type updated successfully!');
      } else {
        // Add new printer type
        await axios.post(PRINTER_TYPES_URL, formData, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Printer type created successfully!');
      }
      
      setShowAddModal(false);
      fetchPrinterTypes(); // Refresh the list after adding/updating
    } catch (error) {
      console.error('Error saving printer type:', error);
      setError('Failed to save printer type. Please check your inputs and try again.');
      toast.error('Failed to save printer type.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  if (isLoading && printerTypes.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="printer-types-container">
      <PageHeader 
        title="Printer Types" 
        subtitle="Manage printer categories and specifications"
        actions={
          <button className="btn btn-success" onClick={handleAddNew}>
            <FaPlus className="mr-1" /> Add Printer Type
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
          <DashboardCard title="Printer Types" className="mb-4">
            <div className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search printer types..."
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

            {filteredPrinterTypes.length === 0 ? (
              <div className="text-center py-5">
                <i className="material-icons empty-icon">print</i>
                <h4>No printer types found</h4>
                <p>Try adjusting your search or create a new printer type.</p>
                <button className="btn btn-primary mt-3" onClick={handleAddNew}>
                  <FaPlus className="mr-1" /> Add Printer Type
                </button>
              </div>
            ) : (
              <div className="printer-types-grid">
                {filteredPrinterTypes.map((type) => (
                  <div key={type.id} className="printer-type-card card">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <h5 className="card-title mb-0">{type.name}</h5>
                      </div>
                      <div>
                        {type.printerCount !== undefined && (
                          <span className="badge badge-primary mr-2">
                            {type.printerCount} Products
                          </span>
                        )}
                        <button 
                          className="btn btn-link p-0" 
                          onClick={() => toggleExpand(type.id)}
                        >
                          {expandedId === type.id ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      {expandedId === type.id && (
                        <div className="printer-type-details mt-3">
                          <h6>Statistics:</h6>
                          <ul className="feature-list">
                            <li className="feature-item">
                              <FaCheck className="feature-check" />
                              <span>Total Printers: {type.printerCount || 0}</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="card-footer bg-transparent">
                      <div className="btn-group w-100">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(type)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(type.id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </div>
      </div>

      {/* Add/Edit Printer Type Modal */}
      {showAddModal && (
        <>
          <div className="modal-backdrop"></div>
          <div className="modal fade show" id="printerTypeModal" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingType ? 'Edit Printer Type' : 'Add New Printer Type'}</h5>
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
                      <label>Printer Type Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
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
                      {isSubmitting ? 'Saving...' : (editingType ? 'Update' : 'Create')} Printer Type
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PrinterTypes;