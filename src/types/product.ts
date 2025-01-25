// src/types/Product.ts
export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  currentPrice: number;
  lastPrice: number;
  isFeatured: boolean;
  createdAt: string;
  category: Category;
}

export interface ProductsResponse {
  page: number;
  totalPages: number;
  totalProducts: number;
  products: Product[];
}
