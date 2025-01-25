import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import useUser from '../../../hooks/useUser';
import { Address } from '../../../types/account';

interface AddAddressModalProps {
  show: boolean;
  onHide: () => void;
  mode: 'Add' | 'Edit';
  addressToEdit?: Address;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({ show, onHide, mode, addressToEdit }) => {
  const { addAddress, editAddress } = useUser();
  const [type, setType] = useState<'Shipping' | 'Billing' | 'Both'>(addressToEdit?.type || 'Shipping');
  const [details, setDetails] = useState<string>(addressToEdit?.details || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!details.trim()) {
      setError('Address details cannot be empty.');
      return;
    }

    if (mode === 'Add') {
      addAddress(type, details);
      onHide();
    } else if (mode === 'Edit' && addressToEdit) {
      editAddress(addressToEdit.id, type, details);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'Add' ? 'Add New Address' : 'Edit Address'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="address-type">
            <Form.Label>Address Type</Form.Label>
            <Form.Select
              value={type}
              onChange={(e) => setType(e.target.value as 'Shipping' | 'Billing' | 'Both')}
              required
            >
              <option value="Shipping">Shipping</option>
              <option value="Billing">Billing</option>
              <option value="Both">Both</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="address-details">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter your address"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {mode === 'Add' ? 'Add Address' : 'Update Address'}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={onHide}>
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAddressModal;
