// import React, { useState } from 'react';
// import { Modal, Button, Form, Alert } from 'react-bootstrap';
// import useUser from '../../../hooks/useUser';
// import { PaymentMethod } from '../../../types/account';

// interface AddPaymentModalProps {
//   show: boolean;
//   onHide: () => void;
//   mode: 'Add' | 'Edit';
//   paymentToEdit?: PaymentMethod;
// }

// const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ show, onHide, mode, paymentToEdit }) => {
//   const { addPaymentMethod, editPaymentMethod } = useUser();
//   const [type, setType] = useState<'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer'>(paymentToEdit?.type || 'Credit Card');
//   const [details, setDetails] = useState<string>(paymentToEdit?.details || '');
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);

//     if (!details.trim()) {
//       setError('Payment details cannot be empty.');
//       return;
//     }

//     if (mode === 'Add') {
//       addPaymentMethod(type, details);
//       onHide();
//     } else if (mode === 'Edit' && paymentToEdit) {
//       editPaymentMethod(paymentToEdit.id, type, details);
//       onHide();
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{mode === 'Add' ? 'Add New Payment Method' : 'Edit Payment Method'}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {error && <Alert variant="danger">{error}</Alert>}
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3" controlId="payment-type">
//             <Form.Label>Payment Type</Form.Label>
//             <Form.Select
//               value={type}
//               onChange={(e) => setType(e.target.value as 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer')}
//               required
//             >
//               <option value="Credit Card">Credit Card</option>
//               <option value="Debit Card">Debit Card</option>
//               <option value="PayPal">PayPal</option>
//               <option value="Bank Transfer">Bank Transfer</option>
//             </Form.Select>
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="payment-details">
//             <Form.Label>Payment Details</Form.Label>
//             <Form.Control
//               type="text"
//               value={details}
//               onChange={(e) => setDetails(e.target.value)}
//               placeholder="Enter payment details"
//               required
//             />
//             <Form.Text className="text-muted">
//               e.g., Card Number, PayPal Email
//             </Form.Text>
//           </Form.Group>

//           <Button variant="primary" type="submit">
//             {mode === 'Add' ? 'Add Payment Method' : 'Update Payment Method'}
//           </Button>
//           <Button variant="secondary" className="ms-2" onClick={onHide}>
//             Cancel
//           </Button>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AddPaymentModal;
