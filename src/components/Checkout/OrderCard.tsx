import React from "react";
import { Card, Badge } from "react-bootstrap";
import { Order } from "../../contexts/orderContext";

interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  onClick: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isSelected, onClick }) => {
  // Calculate total amount
  const totalAmount = order.orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Format date
  const formattedDate = new Date(order.orderDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "warning";
      case "PROCESSING":
        return "info";
      case "SHIPPED":
        return "primary";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Card
      className={`h-100 shadow-sm order-card ${isSelected ? "border-primary" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
    >
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <i className="bi bi-box me-2"></i>
          Order #{order.orderNumber}
        </div>
        {isSelected && (
          <Badge bg="primary" pill>
            Selected
          </Badge>
        )}
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
          <div className="text-muted">Date:</div>
          <div>{formattedDate}</div>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <div className="text-muted">Status:</div>
          <Badge bg={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <div className="text-muted">Items:</div>
          <div>{order.orderItems.length}</div>
        </div>
        <hr />
        <div className="d-flex justify-content-between">
          <div className="text-muted">Total:</div>
          <div className="fw-bold">KSh {totalAmount.toLocaleString()}</div>
        </div>
      </Card.Body>
      {order.orderItems.length > 0 && (
        <Card.Footer className="bg-light">
          <small className="text-muted">
            Recent item: {order.orderItems[0].product.name}
          </small>
        </Card.Footer>
      )}
    </Card>
  );
};

export default OrderCard;