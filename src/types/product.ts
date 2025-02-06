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

export interface CategoryResponse {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentCategoryId?: string | null;
    products: Product[];
    createdAt: string;
    updatedAt: string;
    position: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    status: 'active' | 'archived';
    featured: boolean;
    children?: Category[];
    bannerImageUrl?: string;
    iconUrl?: string;
  };
  totalProducts?: number;
  currentPage?: number;
  totalPages?: number;
}

// export interface Category {
//   id: string;
//   name: string;
//   slug: string;
//   description?: string;
//   imageUrl?: string;
//   parentCategoryId?: string | null;
//   position: number;
//   status: 'active' | 'archived';
//   featured: boolean;
//   createdAt: string;
//   updatedAt: string;
// }
