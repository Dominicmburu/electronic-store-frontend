import React, { useState } from 'react';
import styles from '../../styles/ProductInfo.module.css';
import { Button, Form } from 'react-bootstrap';
import ShareButtons from './ShareButtons';

interface ProductInfoProps {
  name: string;
  currentPrice: number;
  lastPrice: number;
  discount: string;
  stockStatus: string;
  description: string;
  onAddToCart: (quantity: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  currentPrice,
  lastPrice,
  discount,
  stockStatus,
  description,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddToCart(quantity);
  };

  return (
    <div className={styles.productInfo}>
      <h2>{name}</h2>
      <div className={styles.priceSection}>
        <span className={styles.currentPrice}>KSh {currentPrice.toLocaleString()}.00</span>
        <span className={styles.lastPrice}>KSh {lastPrice.toLocaleString()}.00</span>
        <span className={`badge bg-success ms-2`}>{discount} OFF</span>
      </div>
      <p className="text-muted">{stockStatus}</p>
      <p>{description}</p>
      <Form onSubmit={handleSubmit} className={styles.addToCartForm}>
        <Form.Group controlId="quantity" className="mb-3">
          <Form.Label>Quantity:</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          <i className="bi bi-cart-plus me-2"></i> Add to Cart
        </Button>
      </Form>
      <ShareButtons />
    </div>
  );
};

export default ProductInfo;
