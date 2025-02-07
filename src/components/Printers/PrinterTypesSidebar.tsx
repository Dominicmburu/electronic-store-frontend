import React, { useEffect, useState } from 'react';
import styles from '../../styles/PrinterTypesSidebar.module.css';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import productAPI from '../../api/product';

interface PrinterType {
  id: number;
  name: string;
  printerCount: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  images: string[];
  printerTypeId: number;
}

const PrinterTypesSidebar: React.FC = () => {
  const [printerTypes, setPrinterTypes] = useState<PrinterType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedTypes, setExpandedTypes] = useState<number[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchPrinterTypes = async () => {
      try {
        const response = await axios.get<{ printerTypes: PrinterType[] }>(
          `${productAPI.PRINTERSTYPE}?page=1&limit=100`
        );
        setPrinterTypes(response.data.printerTypes);
      } catch (error) {
        console.error("Error fetching printer types:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get<{ categories: Category[] }>(
          `${productAPI.CATEGORIES}?page=1&limit=100`
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchPrinterTypes();
    fetchCategories();
  }, []);

  const toggleExpand = (typeId: number) => {
    setExpandedTypes(prev => 
      prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
    );
  };

  const selectedCategory = searchParams.get('category') || '';

  const groupedCategories = printerTypes.map(type => ({
    ...type,
    categories: categories.filter(cat => cat.printerTypeId === type.id)
  }));

  return (
    <aside className={`col-md-3 ${styles.sidebar}`}>
      <h5>Printer Types</h5>
      <ul className="list-unstyled">
        {groupedCategories.map(type => (
          <li key={type.id} className="mb-2">
            <div 
              className="d-flex justify-content-between align-items-center cursor-pointer" 
              onClick={() => toggleExpand(type.id)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-expanded={expandedTypes.includes(type.id)}
              aria-controls={`categories-${type.id}`}
            >
              <span className={`text-decoration-none ${selectedCategory ? '' : 'fw-bold'}`}>
                {type.name} ({type.printerCount})
              </span>
              <span>
                {expandedTypes.includes(type.id) ? '-' : '+'}
              </span>
            </div>
            {expandedTypes.includes(type.id) && (
              <ul id={`categories-${type.id}`} className="list-unstyled ms-3 mt-2">
                {type.categories.map(category => (
                  <li key={category.id} className="mb-1">
                    <Link
                      to={`/shop?category=${category.id}`}
                      className={`text-decoration-none ${selectedCategory === category.id.toString() ? 'fw-bold text-primary' : 'text-dark'}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default PrinterTypesSidebar;
