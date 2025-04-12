import { useState, useContext } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';

const isValidMpesaNumber = (number: string) => {
  const phoneRegex = /^(07\d{8}|01\d{8})$/;
  return phoneRegex.test(number);
};

const PaymentMethods = () => {
  const [showModal, setShowModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<any>(null);
  const { addPaymentMethod, token, deletePaymentMethod, paymentMethods = [], fetchPaymentMethods } = useContext(UserContext) || {};

  const handleAddPaymentMethod = async () => {
    if (!mpesaNumber) {
      toast.error("Please enter your MPESA number");
      return;
    }

    if (!isValidMpesaNumber(mpesaNumber)) {
      toast.error("Invalid MPESA number. Please enter a valid Kenyan phone number starting with 07 or 01.");
      return;
    }

    try {
      if (addPaymentMethod) {
        await addPaymentMethod("MPESA", mpesaNumber);
        toast.success("MPESA payment method added successfully!");
        if (fetchPaymentMethods) {
          fetchPaymentMethods(token || '');
        }
      } else {
        toast.error("Payment method addition is not available.");
      }
      setShowModal(false);
      setMpesaNumber('');
    } catch (error) {
      toast.error("Failed to add payment method.");
    }
  };

  const handleEditPaymentMethod = async () => {
    if (!mpesaNumber) {
      toast.error("Please enter a new MPESA number");
      return;
    }

    if (!isValidMpesaNumber(mpesaNumber)) {
      toast.error("Invalid MPESA number. Please enter a valid Kenyan phone number starting with 07 or 01.");
      return;
    }

    try {
      if (currentPaymentMethod && currentPaymentMethod.id && addPaymentMethod) {
        await addPaymentMethod("MPESA", mpesaNumber);
        toast.success("MPESA payment method updated successfully!");
        if (fetchPaymentMethods) {
          fetchPaymentMethods(token || '');
        }
      }
      setShowModal(false);
      setMpesaNumber('');
      setIsEditing(false);
      setCurrentPaymentMethod(null);
    } catch (error) {
      toast.error("Failed to update payment method.");
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: number) => {
    try {
      if (deletePaymentMethod) {
        await deletePaymentMethod(paymentMethodId);
        toast.success("Payment method deleted successfully!");
        if (fetchPaymentMethods) {
          fetchPaymentMethods(token || '');
        }
      }
    } catch (error) {
      toast.error("Failed to delete payment method.");
    }
  };

  return (
    <>
      <h5 className="mt-4">Payment Methods</h5>
      <Button variant="success" className="mb-3" onClick={() => setShowModal(true)}>
        <i className="bi bi-plus-circle-fill"></i> Add New Payment Method
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(paymentMethods ?? []).length > 0 ? (
            paymentMethods.map((method: any) => (
              <tr key={method.id}>
                <td>{method.type}</td>
                <td>{method.details}</td>
                <td>
                  <Button size="sm" variant="danger" onClick={() => handleDeletePaymentMethod(method.id)}>
                    <i className="bi bi-trash-fill"></i> Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No payment methods available.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit MPESA Payment Method" : "Add MPESA Payment Method"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="mpesaNumber">
              <Form.Label>MPESA Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your MPESA number"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={isEditing ? handleEditPaymentMethod : handleAddPaymentMethod}>
            {isEditing ? "Update Payment Method" : "Add Payment Method"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PaymentMethods;
