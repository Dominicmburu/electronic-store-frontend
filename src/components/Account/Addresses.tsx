import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import { Address, FetchUserAddressesResponse } from '../../types/account'; 

const Addresses = () => {
  const { token, addAddress, updateAddress, deleteAddress, fetchUserAddresses } = useContext(UserContext) || {};
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null); 
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  useEffect(() => {
    const loadAddresses = async () => {
      if (token && fetchUserAddresses) {
        const data: FetchUserAddressesResponse = await fetchUserAddresses(token);        
        setAddresses(data.addresses);         
      }
    };
    loadAddresses();
  }, [token, fetchUserAddresses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async () => {
    if (addAddress && updateAddress) {
      try {
        if (isEditing && currentAddress) {
          await updateAddress(currentAddress.id, formData); // Update address with the correct ID
          toast.success('Address updated successfully!');
        } else {
          await addAddress(formData); // Add new address
          toast.success('Address added successfully!');
        }
        setShowModal(false);
        setFormData({
          address: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        });
        setIsEditing(false); // Reset edit mode flag
        setCurrentAddress(null); // Clear the current address
        // Reload addresses after adding/updating
        if (token && fetchUserAddresses) {
          const data: FetchUserAddressesResponse = await fetchUserAddresses(token);
          setAddresses(data.addresses); // Set addresses after add or update
        }
      } catch (err) {
        toast.error('Failed to add/update address.');
      }
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (deleteAddress) {
      try {
        await deleteAddress(id);
        toast.success('Address deleted successfully!');
        // Reload addresses after deletion
        if (token && fetchUserAddresses) {
          const data: FetchUserAddressesResponse = await fetchUserAddresses(token);
          setAddresses(data.addresses); // Set addresses after deletion
        }
      } catch (err) {
        toast.error('Failed to delete address.');
      }
    }
  };

  const handleEditAddress = (address: Address) => {
    setCurrentAddress(address);
    setFormData({
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    });
    setIsEditing(true); // Set editing mode
    setShowModal(true); // Open the modal for editing
  };

  return (
    <>
      <h5 className="mt-4">Address Book</h5>
      <Button variant="success" className="mb-3" onClick={() => {
          setShowModal(true);
          setIsEditing(false);
          setCurrentAddress(null);
          setFormData({
            address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
          });
        }}>
        <i className="bi bi-plus-circle-fill"></i> Add New Address
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address: Address) => (
            <tr key={address.id}>
              <td>{address.address}</td>
              <td>{address.city}</td>
              <td>{address.state}</td>
              <td>{address.zip}</td>
              <td>{address.country}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2" onClick={() => handleEditAddress(address)}>
                  <i className="bi bi-pencil-square"></i> Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDeleteAddress(address.id)}>
                  <i className="bi bi-trash-fill"></i> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for adding or editing an address */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Address' : 'Add New Address'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </Form.Group>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </Form.Group>
            <Form.Group controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
              />
            </Form.Group>
            <Form.Group controlId="zip">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="Enter zip code"
              />
            </Form.Group>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddAddress}>
            {isEditing ? 'Update Address' : 'Add Address'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Addresses;
