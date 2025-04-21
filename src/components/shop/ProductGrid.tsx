import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types/product';
import ProductCard from '../Printers/ProductCard';

// Animation variants
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const productVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200
    }
  },
  hover: {
    y: -10,
    scale: 1.03,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => (
  <motion.div 
    className="row g-4"
    variants={gridVariants}
    initial="hidden"
    animate="visible"
  >
    {products.map((product) => (
      <motion.div
        key={product.id}
        className="col-6 col-md-6 col-lg-4"
        variants={productVariants}
        whileHover="hover"
        initial="hidden"
        animate="visible"
        layout
      >
        <ProductCard product={product} />
      </motion.div>
    ))}
  </motion.div>
);

export default React.memo(ProductGrid);
