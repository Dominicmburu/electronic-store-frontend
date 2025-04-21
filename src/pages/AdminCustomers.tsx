// pages/customers/Customers.tsx
import React, { useState, useEffect } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import '../styles/Admin/Customers.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaEye, FaEdit, FaCheck, FaBan, FaTrash, FaUser } from 'react-icons/fa';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  phoneNumber?: string;
}

interface UserResponse {
  page: number;
  totalPages: number;
  users: User[];
}

const Customers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStatus, setCurrentStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // New state for the user creation/editing modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'USER'
  });

  // API base URL
  const API_BASE_URL = 'http://127.0.0.1:5000/api';

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, currentStatus]);

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get<UserResponse>(`${API_BASE_URL}/admin/users?page=${page}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`);
      setSelectedUser(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details. Please try again.');
    }
  };

  const handleUpdateStatus = async (userId: number, isActive: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/admin/users/${userId}/active`, {
        isActive: !isActive
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: !isActive } : user
      ));
      
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status. Please try again.');
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: false } : user
      ));
      
      toast.success('User deactivated successfully!');
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error('Failed to deactivate user. Please try again.');
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isEditing && selectedUser) {
        // Update user
        await axios.put(`${API_BASE_URL}/admin/${selectedUser.id}`, {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password || undefined // Only send password if provided
        });
        toast.success('User updated successfully!');
      } else {
        // Create new user/admin
        await axios.post(`${API_BASE_URL}/admin/register`, formData);
        toast.success('User created successfully!');
      }
      
      // Close modal and refresh data
      setShowUserModal(false);
      fetchUsers(currentPage);
    } catch (error: any) {
      console.error('Error saving user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save user. Please check the form and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      password: '', // Don't show existing password
      role: user.role
    });
    setSelectedUser(user);
    setIsEditing(true);
    setError(null);
    setShowUserModal(true);
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: 'USER'
    });
    setSelectedUser(null);
    setIsEditing(false);
    setError(null);
    setShowUserModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(user.id).includes(searchTerm);
    const matchesStatus = currentStatus === 'all' || 
                          (currentStatus === 'active' && user.isActive) ||
                          (currentStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="customers-container">
      <PageHeader 
        title="Users Management" 
        subtitle="Manage your user accounts"
        actions={
          <button className="btn btn-success" onClick={openCreateModal}>
            <FaPlus className="mr-1" /> Add User
          </button>
        }
      />
      
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {users.length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaUser className="text-gray-300" style={{ fontSize: '2rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Active Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {users.filter(u => u.isActive).length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaCheck className="text-gray-300" style={{ fontSize: '2rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Admins
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {users.filter(u => u.role === 'ADMIN').length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaUser className="text-gray-300" style={{ fontSize: '2rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Inactive Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {users.filter(u => !u.isActive).length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaBan className="text-gray-300" style={{ fontSize: '2rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DashboardCard title='User List' className="mb-4">
        <div className="customer-filters mb-4">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-md-end">
                <div className="btn-group">
                  <button 
                    className={`btn ${currentStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {
                      setCurrentStatus('all');
                    }}
                  >
                    All
                  </button>
                  <button 
                    className={`btn ${currentStatus === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {
                      setCurrentStatus('active');
                    }}
                  >
                    Active
                  </button>
                  <button 
                    className={`btn ${currentStatus === 'inactive' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {
                      setCurrentStatus('inactive');
                    }}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-5">
            <FaUser className="empty-icon text-muted" size={64} />
            <h4>No users found</h4>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td><strong>{user.id}</strong></td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'ADMIN' ? 'badge-info' : 'badge-primary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-secondary'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => fetchUserDetails(user.id)}
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-info"
                            onClick={() => openEditModal(user)}
                            title="Edit User"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleUpdateStatus(user.id, user.isActive)}
                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.isActive ? <FaBan /> : <FaCheck />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                Showing page {currentPage} of {totalPages}
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

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button type="button" className="close" onClick={() => setShowDetailModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center mb-4 mb-md-0">
                    <div className="customer-profile-image mb-3">
                      <FaUser style={{ fontSize: '5rem' }} className="text-primary" />
                    </div>
                    <h5>{selectedUser.name}</h5>
                    <span className={`badge ${selectedUser.isActive ? 'badge-success' : 'badge-secondary'} mb-3`}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="btn-group mt-3">
                      <a 
                        href={`mailto:${selectedUser.email}`} 
                        className="btn btn-sm btn-outline-primary"
                        title="Send Email"
                      >
                        <FaEdit className="mr-1" /> Email
                      </a>
                      <button 
                        className="btn btn-sm btn-outline-success" 
                        onClick={() => openEditModal(selectedUser)}
                        title="Edit User"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="customer-info">
                      <h6 className="border-bottom pb-2">User Information</h6>
                      <div className="row mb-3">
                        <div className="col-sm-4 text-sm-right">
                          <strong>ID:</strong>
                        </div>
                        <div className="col-sm-8">
                          {selectedUser.id}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-4 text-sm-right">
                          <strong>Email:</strong>
                        </div>
                        <div className="col-sm-8">
                          <a href={`mailto:${selectedUser.email}`}>{selectedUser.email}</a>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-4 text-sm-right">
                          <strong>Role:</strong>
                        </div>
                        <div className="col-sm-8">
                          <span className={`badge ${selectedUser.role === 'ADMIN' ? 'badge-info' : 'badge-primary'}`}>
                            {selectedUser.role}
                          </span>
                        </div>
                      </div>
                      {selectedUser.phoneNumber && (
                        <div className="row mb-4">
                          <div className="col-sm-4 text-sm-right">
                            <strong>Phone:</strong>
                          </div>
                          <div className="col-sm-8">
                            <a href={`tel:${selectedUser.phoneNumber}`}>{selectedUser.phoneNumber}</a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => {
                    handleDeactivateUser(selectedUser.id);
                    setShowDetailModal(false);
                  }}
                >
                  {selectedUser.isActive ? 'Deactivate User' : 'Delete User'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={() => {
                    handleUpdateStatus(selectedUser.id, selectedUser.isActive);
                    setShowDetailModal(false);
                  }}
                >
                  {selectedUser.isActive ? 'Set Inactive' : 'Activate User'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      {/* Create/Edit User Modal */}
      {showUserModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? 'Edit User' : 'Create New User'}</h5>
                <button type="button" className="close" onClick={() => setShowUserModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={handleModalSubmit}>
                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger">{error}</div>
                  )}
                  
                  <div className="form-group">
                    <label>Name</label>
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
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>{isEditing ? 'Password (Leave blank to keep current)' : 'Password'}</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      className="form-control"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowUserModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
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

export default Customers;