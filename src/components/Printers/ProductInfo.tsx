import React, { useState } from 'react';
import styles from '../../styles/ProductInfo.module.css';
import { Button, Form } from 'react-bootstrap';
import ShareButtons from './ShareButtons';
import { useCart } from '../../contexts/cartContext';
import { useWishlist } from '../../contexts/wishListContext';
import { toast } from 'react-toastify';

interface ProductInfoProps {
  product: {
    id: number;
    name: string;
    currentPrice: number;
    lastPrice: number;
    discount: string;
    stockStatus: string;
    description: string;
  };
}

const ProductInfo: React.FC<ProductInfoProps> = ({product}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart, loading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();

  const productInWishlist = isInWishlist(product.id);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addToCart(product.id, quantity);
  };

  const toggleWishlist = async () => {
    if (productInWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  return (
    <div className={styles.productInfo}>
      <h2>{product.name}</h2>
      <div className={styles.priceSection}>
        <span className={styles.currentPrice}>KSh {product.currentPrice.toLocaleString()}</span>
        <span className={styles.lastPrice}>KSh {product.lastPrice.toLocaleString()}</span>
        <span className={`badge bg-success ms-2`}>{product.discount} OFF</span>
      </div>
      <p className="text-muted">{product.stockStatus}</p>
      <p>{product.description}</p>
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
        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            type="submit"
            disabled={cartLoading}
            className="flex-grow-1"
          >
            <i className="bi bi-cart-plus me-2"></i> Add to Cart
          </Button>
          <Button
            variant={productInWishlist ? "danger" : "outline-danger"}
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className="ms-2"
          >
            <i className={`bi ${productInWishlist ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          </Button>
        </div>
      </Form>
      <ShareButtons />
    </div>
  );
};

export default ProductInfo;