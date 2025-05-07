// pages/admin/Profile.tsx
import React, { useState, useEffect, useContext } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api/main';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave, FaEye, FaEyeSlash, FaBan } from 'react-icons/fa';
import '../styles/Admin/Settings.css'

const AdminSettings: React.FC = () => {
  const userContext = useContext(UserContext);
  const { token, profile } = userContext || {};
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state - only password fields are editable
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Validation state - only for password fields
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordInputChange = (field: string, value: string) => {
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

  const validatePasswordForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    let isValid = true;
    
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

  const handleSavePassword = async () => {
    if (!validatePasswordForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    if (!showPasswordFields) {
      toast.info('No changes to save');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const adminId = profile?.id;
      
      // Only send password update
      const payload = {
        currentPassword: formData.currentPassword,
        password: formData.newPassword,
      };
      
      const response = await axios.put(`${API_BASE_URL}/admin/${adminId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        toast.success('Password updated successfully!');
        setHasChanges(false);
        
        // Reset password fields
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setShowPasswordFields(false);
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update password. Please try again.';
      toast.error(errorMessage);
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

  if (isLoading || !profile) {
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
            onClick={handleSavePassword}
            disabled={isSaving || !hasChanges || !showPasswordFields}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-1" /> Save Password
              </>
            )}
          </button>
        }
      />

      <div className="row">
        {/* Rest of the component remains the same */}
        <div className="col-lg-4 mb-4">
          <DashboardCard title="Profile Summary">
            <div className="text-center mb-4">
              <div className="avatar-circle mx-auto mb-3">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <h4>{profile.name || 'Admin User'}</h4>
              <span className="badge badge-primary">Administrator</span>
            </div>
            
            <div className="profile-info">
              <div className="profile-info-item">
                <div className="info-label">Email</div>
                <div className="info-value">
                  <FaEnvelope className="mr-2" />
                  {profile.email || 'admin@example.com'}
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="info-label">Phone</div>
                <div className="info-value">
                  <FaPhone className="mr-2" />
                  {profile.phoneNumber || 'Not set'}
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="info-label">Account Created</div>
                <div className="info-value">
                  {formatDate(profile.createdAt)}
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="info-label">Last Updated</div>
                <div className="info-value">
                  {formatDate(profile.updatedAt)}
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
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={profile.name || ''}
                        disabled
                        readOnly
                      />                      
                    </div>
                    <small className="text-muted">Name cannot be changed</small>
                  </div>
                </div>
                
                <div className="col-md-6 mb-4">
                  <div className="form-group">
                    <label htmlFor="email">
                      <FaEnvelope className="mr-2" /> Email Address
                    </label>
                    <div className="input-group">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={profile.email || ''}
                        disabled
                        readOnly
                      />                      
                    </div>
                    <small className="text-muted">Email cannot be changed</small>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-group">
                    <label htmlFor="phoneNumber">
                      <FaPhone className="mr-2" /> Phone Number
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="phoneNumber"
                        value={profile.phoneNumber || ''}
                        disabled
                        readOnly
                      />                      
                    </div>
                    <small className="text-muted">Phone number cannot be changed</small>
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
                            onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
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
                            onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
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
                            onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
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
                    onClick={handleSavePassword}
                    disabled={isSaving || !hasChanges || !showPasswordFields}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-1" /> Save Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;