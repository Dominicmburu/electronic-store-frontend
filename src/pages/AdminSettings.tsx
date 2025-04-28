// pages/admin/Profile.tsx
import React, { useState, useEffect, useContext } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api/main';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserEdit, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';

interface AdminProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

const AdminSettings: React.FC = () => {
  const { token, user } = useContext(UserContext) || {};
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    setIsLoading(true);
    try {
      // If we have user ID from context, use it, otherwise default to 3 from the example
      const adminId = user?.id || 3;
      
      const response = await axios.get(`${API_BASE_URL}/admin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setProfile(response.data);
        // Initialize form data
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      toast.error('Failed to load profile. Please try again.');
      
      // For demo purposes, set dummy data if API fails
      const dummyProfile = {
        id: 3,
        name: "Admin User",
        email: "admin@gmail.com",
        phoneNumber: "0706526569",
        role: "Super Admin",
        createdAt: "2023-09-15T08:30:00",
        lastLogin: "2023-10-30T14:22:15"
      };
      
      setProfile(dummyProfile);
      setFormData({
        name: dummyProfile.name,
        email: dummyProfile.email,
        phoneNumber: dummyProfile.phoneNumber,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear the error for this field when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
    
    setHasChanges(true);
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phoneNumber: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    let isValid = true;
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    }
    
    // Password validation (only if password change is requested)
    if (showPasswordFields) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
        isValid = false;
      }
      
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
        isValid = false;
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
        isValid = false;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const adminId = profile?.id || 3;
      
      // Prepare payload based on whether password is being updated
      const payload = showPasswordFields ? {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.newPassword
      } : {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      };
      
      const response = await axios.put(`${API_BASE_URL}/admin/${adminId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        toast.success('Profile updated successfully!');
        setHasChanges(false);
        
        // Reset password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setShowPasswordFields(false);
        
        // Update profile with new data
        setProfile({
          ...profile!,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-container">
      <PageHeader
        title="Admin Profile"
        subtitle="Manage your account information"
        actions={
          <button
            className="btn btn-success"
            onClick={handleSaveProfile}
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-1" /> Save Changes
              </>
            )}
          </button>
        }
      />

      <div className="row">
        <div className="col-lg-4 mb-4">
          <DashboardCard title="Profile Summary">
            <div className="text-center mb-4">
              <div className="avatar-circle mx-auto mb-3">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <h4>{profile?.name || 'Admin User'}</h4>
              <span className="badge badge-primary">{profile?.role || 'Administrator'}</span>
            </div>
            
            <div className="profile-info">
              <div className="profile-info-item">
                <div className="info-label">Email</div>
                <div className="info-value">
                  <FaEnvelope className="mr-2" />
                  {profile?.email || 'admin@example.com'}
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="info-label">Phone</div>
                <div className="info-value">
                  <FaPhone className="mr-2" />
                  {profile?.phoneNumber || 'Not set'}
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="info-label">Account Created</div>
                <div className="info-value">
                  {formatDate(profile?.createdAt)}
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="info-label">Last Login</div>
                <div className="info-value">
                  {formatDate(profile?.lastLogin)}
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        <div className="col-lg-8">
          <DashboardCard title="Edit Profile">
            <form>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-group">
                    <label htmlFor="name">
                      <FaUser className="mr-2" /> Full Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                </div>
                
                <div className="col-md-6 mb-4">
                  <div className="form-group">
                    <label htmlFor="email">
                      <FaEnvelope className="mr-2" /> Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-group">
                    <label htmlFor="phoneNumber">
                      <FaPhone className="mr-2" /> Phone Number
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                    {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                  >
                    <FaLock className="mr-2" /> 
                    {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
                  </button>
                </div>
              </div>
              
              {showPasswordFields && (
                <div className="password-change-section">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                            id="currentPassword"
                            value={formData.currentPassword}
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                          />
                          <div className="input-group-append">
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        {errors.currentPassword && <div className="invalid-feedback d-block">{errors.currentPassword}</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                            id="newPassword"
                            value={formData.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          />
                          <div className="input-group-append">
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        {errors.newPassword && <div className="invalid-feedback d-block">{errors.newPassword}</div>}
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-4">
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          />
                          <div className="input-group-append">
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="row mt-4">
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSaveProfile}
                    disabled={isSaving || !hasChanges}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-1" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </DashboardCard>
        </div>
      </div>

      {/* Add CSS for avatar and profile styling */}
      <style jsx>{`
        .avatar-circle {
          width: 100px;
          height: 100px;
          background-color: #0275d8;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 36px;
          font-weight: bold;
        }

        .profile-info {
          margin-top: 20px;
        }

        .profile-info-item {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .profile-info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #666;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .info-value {
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .password-change-section {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;