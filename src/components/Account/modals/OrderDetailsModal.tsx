// src/components/Account/modals/OrderDetailsModal.tsx

import React from 'react';
import { Modal, Button, Table, Image } from 'react-bootstrap';
import { Order } from '../../../types/account';
import styles from '../../../styles/Account/OrderDetailsModal.module.css';

interface OrderDetailsModalProps {
  show: boolean;
  onHide: () => void;
  order: Order | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ show, onHide, order }) => {
  if (!order) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Details - #{order.orderNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <hr />
        <h6>Items Ordered</h6>
        <Table bordered>
          <thead>
            <tr>
              <th>Product</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id}>
                <td>
                  <Image src={item.image} alt={item.name} style={{ width: '60px' }} fluid />
                </td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>KSh {item.price.toLocaleString()}.00</td>
                <td>KSh {item.subtotal.toLocaleString()}.00</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="text-end">
          <h5>Total: KSh {order.total.toLocaleString()}.00</h5>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;
