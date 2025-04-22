import React from 'react';
import '../../../styles/Admin/DeleteConfirmationModal.css';

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  onConfirm,
  onCancel,
  isDeleting
}) => {
  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">
              <i className="material-icons mr-2 align-middle">warning</i>
              Confirm Deletion
            </h5>
            <button type="button" className="close" onClick={onCancel}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="alert alert-warning">
              <i className="material-icons mr-2 align-middle">info</i>
              Deleting this product will remove it from your inventory and any associated order history.
            </div>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="material-icons mr-1">delete</i> Delete Product
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default DeleteConfirmationModal;