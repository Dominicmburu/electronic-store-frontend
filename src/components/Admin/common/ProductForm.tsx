import React, { useState, useEffect } from 'react';
import { Product, ProductSpecifications } from '../Services/ProductService';
import '../../../styles/Admin/ProductForm.css';
import { API_BASE_URL } from '../../../api/main';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import axios from 'axios';

interface ProductFormProps {
  product: Product | null;
  onSubmit: (productData: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface SpecificationEntry {
  key: string;
  value: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lastPrice: 0,
    currentPrice: 0,
    stockQuantity: 0,
    categoryId: 0,
    isFeatured: false
  });

  const [specifications, setSpecifications] = useState<SpecificationEntry[]>([
    { key: '', value: '' }
  ]);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        lastPrice: product.lastPrice,
        currentPrice: product.currentPrice,
        stockQuantity: product.stockQuantity || 0,
        categoryId: product.categoryId,
        isFeatured: product.isFeatured || false
      });

      if (product.images && product.images.length > 0) {
        setExistingImages(product.images);
      }

      if (product.specifications) {
        const specEntries = Object.entries(product.specifications).map(
          ([key, value]) => ({ key, value })
        );

        if (specEntries.length === 0) {
          setSpecifications([{ key: '', value: '' }]);
        } else {
          setSpecifications(specEntries);
        }
      }
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        const data = Array.isArray(response.data) ? response.data : response.data.categories || [];
        setCategories(data);
      } catch (err) {
        setError('Could not load categories.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'categoryId') {
      const numericValue = Number(value);
      setFormData({ ...formData, [name]: numericValue });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index][field] = value;
    setSpecifications(updatedSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      const updatedSpecs = specifications.filter((_, i) => i !== index);
      setSpecifications(updatedSpecs);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImagesToUpload: File[] = [];
    const newImagePreviews: string[] = [];
    const newImageErrors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.match('image.*')) {
        newImageErrors.push(`${file.name} is not an image file.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        newImageErrors.push(`${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }

      newImagesToUpload.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImagePreviews.push(e.target.result as string);
          setImagePreviews([...imagePreviews, ...newImagePreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    setImagesToUpload([...imagesToUpload, ...newImagesToUpload]);
    setImageErrors(newImageErrors);
  };

  const removeUploadImage = (index: number) => {
    const updatedImages = [...imagesToUpload];
    updatedImages.splice(index, 1);
    setImagesToUpload(updatedImages);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const removeExistingImage = (index: number) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
  };

  const validateForm = () => {
    const { name, description, lastPrice, currentPrice, stockQuantity } = formData;

    if (name.length < 4 || name.length > 100) {
      alert("Name must be between 4 and 100 characters.");
      return false;
    }

    if (description.length < 10 || description.length > 1000) {
      alert("Description must be between 10 and 1000 characters.");
      return false;
    }

    if (!Number.isInteger(lastPrice) || lastPrice <= 0) {
      alert("Original Price must be a positive whole number.");
      return false;
    }

    if (!Number.isInteger(currentPrice) || currentPrice <= 0) {
      alert("Current Price must be a positive whole number.");
      return false;
    }

    if (stockQuantity < 0) {
      alert("Stock Quantity cannot be negative.");
      return false;
    }

    if (imagesToUpload.length === 0 && existingImages.length === 0) {
      alert("At least one image must be uploaded.");
      return false;
    }

    if (specifications.some(spec => !spec.key.trim() || !spec.value.trim())) {
      alert("All specifications must have both key and value.");
      return false;
    }

    return true;
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   const finalFormData = {
  //     ...formData,
  //     categoryId: Number(formData.categoryId)
  //   };

  //   const specificationsObject: ProductSpecifications = {};
  //   specifications.forEach((spec) => {
  //     if (spec.key.trim() && spec.value.trim()) {
  //       specificationsObject[spec.key.trim()] = spec.value.trim();
  //     }
  //   });

  //   const productData = {
  //     ...finalFormData,
  //     specifications: specificationsObject,
  //     images: existingImages,
  //     newImages: imagesToUpload
  //   };

  //   onSubmit(productData);
  // };
// Corrected handleSubmit function for ProductForm.tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  const submitFormData = new FormData();

  // Add basic product information
  submitFormData.append('name', formData.name.toString());
  submitFormData.append('description', formData.description.toString());
  submitFormData.append('lastPrice', formData.lastPrice.toString());
  submitFormData.append('currentPrice', formData.currentPrice.toString());
  submitFormData.append('stockQuantity', formData.stockQuantity.toString());
  submitFormData.append('categoryId', formData.categoryId.toString());
  submitFormData.append('isFeatured', formData.isFeatured.toString());

  // Handle specifications - convert object to JSON string
  const specificationsObject: ProductSpecifications = {};
  specifications.forEach(spec => {
    if (spec.key.trim() && spec.value.trim()) {
      specificationsObject[spec.key.trim()] = spec.value.trim();
    }
  });
  submitFormData.append('specifications', JSON.stringify(specificationsObject));

  // Handle existing images - convert array to JSON string
  if (existingImages.length > 0) {
    submitFormData.append('existingImages', JSON.stringify(existingImages));
  }

  // Handle new images
  if (imagesToUpload.length > 0) {
    imagesToUpload.forEach(file => {
      submitFormData.append('images', file);
    });
  }

  onSubmit(submitFormData);
};

  const getImageUrl = (imageName: string) => {
    return imageName.startsWith('http') ? imageName : `${API_BASE_URL}/uploads/${imageName}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product ? 'Edit Product' : 'Add New Product'}</h5>
            <button type="button" className="close" onClick={onCancel}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group">
                    <label htmlFor="name">Product Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="lastPrice">Original Price <span className="text-danger">*</span></label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">KES</span>
                          </div>
                          <input
                            type="number"
                            className="form-control"
                            id="lastPrice"
                            name="lastPrice"
                            min="0"
                            step="1"
                            value={formData.lastPrice}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="currentPrice">Current Price <span className="text-danger">*</span></label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">KES</span>
                          </div>
                          <input
                            type="number"
                            className="form-control"
                            id="currentPrice"
                            name="currentPrice"
                            min="0"
                            step="1"
                            value={formData.currentPrice}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="stockQuantity">Stock Quantity</label>
                        <input
                          type="number"
                          className="form-control"
                          id="stockQuantity"
                          name="stockQuantity"
                          min="0"
                          value={formData.stockQuantity}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="categoryId">Category <span className="text-danger">*</span></label>
                        <select
                          className="form-control"
                          id="categoryId"
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                      />
                      <label className="custom-control-label" htmlFor="isFeatured">
                        Feature this product on the homepage
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  {/* Images Section */}
                  <div className="card">
                    <div className="card-header">Product Images</div>
                    <div className="card-body">
                      {/* Existing Images */}
                      {existingImages.length > 0 && (
                        <div className="existing-images mb-3">
                          <label>Current Images:</label>
                          <div className="image-previews">
                            {existingImages.map((image, index) => (
                              <div key={index} className="image-preview-container">
                                <img
                                  src={getImageUrl(image)}
                                  alt={`Product ${index + 1}`}
                                  className="image-preview"
                                />
                                <button
                                  type="button"
                                  className="btn-sm btn-danger image-remove-btn"
                                  onClick={() => removeExistingImage(index)}
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Image Upload */}
                      <div className="form-group">
                        <label htmlFor="images">Upload Images:</label>
                        <div className="custom-file">
                          <input
                            type="file"
                            className="custom-file-input"
                            id="images"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                          />
                          <label className="custom-file-label" htmlFor="images">Choose files</label>
                        </div>
                        <small className="form-text text-muted">Max file size: 5MB. Supported formats: JPG, PNG, GIF.</small>
                      </div>

                      {/* New Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="new-images mt-3">
                          <label>New Images:</label>
                          <div className="image-previews">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="image-preview-container">
                                <img src={preview} alt={`Upload ${index + 1}`} className="image-preview" />
                                <button
                                  type="button"
                                  className=" btn-sm btn-danger image-remove-btn"
                                  onClick={() => removeUploadImage(index)}
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Image Errors */}
                      {imageErrors.length > 0 && (
                        <div className="alert alert-danger mt-3">
                          <ul className="mb-0">
                            {imageErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications Section */}
              <div className="specifications-section mt-4">
                <h6 className="mb-3">Product Specifications</h6>

                {specifications.map((spec, index) => (
                  <div key={index} className="specification-row row mb-2">
                    <div className="col-md-5">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Specification Name"
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                      />
                    </div>
                    <div className="col-md-5">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Specification Value"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-block"
                        onClick={() => removeSpecification(index)}
                        disabled={specifications.length === 1}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline-primary mt-2"
                  onClick={addSpecification}
                >
                  <FaPlus className="mr-1" /> Add Specification
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>Save Product</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
