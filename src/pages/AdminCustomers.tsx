// pages/customers/Customers.tsx
import React, { useState, useEffect, useContext } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import '../styles/Admin/Customers.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaEye, FaEdit, FaCheck, FaBan, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { API_BASE_URL } from '../api/main';
import { UserContext } from '../contexts/UserContext';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  phoneNumber?: string;
}

// interface UserResponse {
//   page: number;
//   totalPages: number;
//   users: User[];
// }

const Customers: React.FC = () => {
  const { token } = useContext(UserContext) || {};
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStatus, setCurrentStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  useEffect(() => {
    fetchUsers();
  }, [currentPage, currentStatus, token]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // In Customers.tsx
  const fetchUserDetails = async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedUser(response.data.user);
      setShowDetailModal(true);
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load user details. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleUpdateStatus = async (userId: number, isActive: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/admin/users/${userId}/active`, {
        isActive: !isActive
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        await axios.put(`${API_BASE_URL}/admin/users/${selectedUser.id}`, {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          // password: formData.password || undefined // Only send password if provided (if your backend supports this)
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('User updated successfully!');
      } else {
        const endpoint = formData.role === 'ADMIN'
          ? `${API_BASE_URL}/admin/register`
          : `${API_BASE_URL}/admin/users`;

        await axios.post(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('User created successfully!');
      }

      setShowUserModal(false);
      fetchUsers();
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
              <div className="modal-header border-bottom-0 pb-1">
                <h5 className="modal-title font-weight-bold">User Profile</h5>
                <button type="button" className="close" onClick={() => setShowDetailModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body pt-0">
                <div className="row">
                  <div className="col-md-4 text-center mb-4 mb-md-0">
                    <div className="customer-profile-image mb-3 d-flex align-items-center justify-content-center">
                      <div className="rounded-circle bg-primary-light d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                        <FaUser style={{ fontSize: '3.5rem' }} className="text-primary" />
                      </div>
                    </div>
                    <h4 className="font-weight-bold mb-1">{selectedUser.name}</h4>
                    <p className="text-muted mb-2">{selectedUser.email}</p>
                    <span className={`badge ${selectedUser.isActive ? 'badge-success' : 'badge-secondary'} px-3 py-2 mb-3 rounded-pill`}>
                      {selectedUser.isActive ? '● Active' : '● Inactive'}
                    </span>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <a
                        href={`mailto:${selectedUser.email}`}
                        className="btn btn-outline-primary rounded-pill px-4"
                        title="Send Email"
                      >
                        <FaEnvelope className="mr-1" /> Email
                      </a>
                      <button
                        className="btn btn-outline-success rounded-pill px-4"
                        onClick={() => openEditModal(selectedUser)}
                        title="Edit User"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <h6 className="text-uppercase font-weight-bold text-muted mb-3 border-bottom pb-2">
                          User Information
                        </h6>
                        <div className="user-details">
                          <div className="detail-item mb-3">
                            <label className="font-weight-bold mb-1 d-block">User ID</label>
                            <p className="mb-0 text-muted">#{selectedUser.id}</p>
                          </div>
                          <div className="detail-item mb-3">
                            <label className="font-weight-bold mb-1 d-block">Email Address</label>
                            <p className="mb-0">
                              <a href={`mailto:${selectedUser.email}`} className="text-primary">
                                <FaEnvelope className="mr-1" />{selectedUser.email}
                              </a>
                            </p>
                          </div>
                          <div className="detail-item mb-3">
                            <label className="font-weight-bold mb-1 d-block">Role</label>
                            <span className={`badge ${selectedUser.role === 'ADMIN' ? 'badge-info' : 'badge-primary'} px-3 py-2 rounded-pill`}>
                              {selectedUser.role}
                            </span>
                          </div>
                          {selectedUser.phoneNumber && (
                            <div className="detail-item mb-3">
                              <label className="font-weight-bold mb-1 d-block">Phone Number</label>
                              <p className="mb-0">
                                <a href={`tel:${selectedUser.phoneNumber}`} className="text-primary">
                                  <FaPhone className="mr-1" />{selectedUser.phoneNumber}
                                </a>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top mt-3">
                <button
                  type="button"
                  className="btn btn-light rounded-pill"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className={`btn ${selectedUser.isActive ? 'btn-warning' : 'btn-success'} rounded-pill`}
                  onClick={() => {
                    handleUpdateStatus(selectedUser.id, selectedUser.isActive);
                    setShowDetailModal(false);
                  }}
                >
                  {selectedUser.isActive ? 'Deactivate' : 'Activate'} User
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill"
                  onClick={() => {
                    handleDeactivateUser(selectedUser.id);
                    setShowDetailModal(false);
                  }}
                >
                  Delete User
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