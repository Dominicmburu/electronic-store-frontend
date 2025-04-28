import { useState, useContext, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import { fetchWishlistAPI } from '../../contexts/wishlistHelper';
import { API_BASE_URL } from '../../api/main';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const { token, removeFromWishlist, fetchWishlist } = useContext(UserContext) || {};

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (fetchWishlist) {
          const response = await fetchWishlist(token || '');
          setWishlistItems(response.wishlist);
        }
      } catch (error) {
        // toast.error("Failed to fetch wishlist items.");
      }
    };
    fetchItems();
  }, [fetchWishlist]);

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      if (removeFromWishlist) {
        await removeFromWishlist(productId);
        toast.success("Product removed from wishlist.");
        const response = await fetchWishlistAPI(token || '');
        setWishlistItems(response.wishlist);
      }
    } catch (error) {
      toast.error("Failed to remove product from wishlist.");
    }
  };

  return (
    <>
      <h5 className="mt-4">Wishlist</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item: any) => (
              <tr key={item.productId}>
                <td>
                  <img src={ `${API_BASE_URL}/uploads/${item.product.images[0]}`} alt={item.product.name} style={{ width: '60px' }} />
                </td>
                <td>{item.product.name}</td>
                <td>KSh {item.product.currentPrice}</td>
                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                  >
                    <i className="bi bi-trash-fill"></i> Remove
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No products in your wishlist.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default Wishlist;
