import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import StoreLocator from "./pages/StoreLocator";
import Cart from "./pages/Cart";
import TrackOrder from "./pages/TrackOrder";
import MyAccount from "./pages/MyAccount";
import { UserProvider } from "./contexts/UserContext";
import Checkout from "./pages/Checkout";
import ContactUs from "./pages/ContactUs";
import { CartProvider } from "./contexts/cartContext";
import { WishlistProvider } from "./contexts/wishListContext";
import { WalletProvider } from "./contexts/walletContext";
import { OrderProvider } from "./contexts/orderContext";

// Admin
import AppLayout from "./components/Admin/AppLayout";
import { SidebarProvider } from "./components/Admin/Context/SidebarContext";
import { NotificationProvider } from "./components/Admin/Context/NotificationContext";
import Dashboard from "./pages/AdminDashboard";
import Orders from "./pages/AdminOrders";
import Products from "./pages/AdminProducts";
import Categories from "./pages/AdminCategories";
import PrinterTypes from "./pages/AdminPrinterTypes";
import Customers from "./pages/AdminCustomers";
import Payments from "./pages/AdminPayments";
import Reports from "./pages/AdminReport";
import Settings from "./pages/AdminSettings";

const AppRoutes = () => {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <WishlistProvider>
            <WalletProvider>
              <OrderProvider>
                <NotificationProvider>
                  <SidebarProvider>
                    <ToastContainer
                      position="top-right"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                    />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product-details/:id" element={<ProductDetails />} />
                      <Route path="/store-locations" element={<StoreLocator />} />
                      <Route path="/my-account" element={<MyAccount />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/contact-us" element={<ContactUs />} />
                      <Route path="/track-order/:orderNumber" element={<TrackOrder />} />

                      {/* Admin Routes */}
                      <Route path="/printers/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                      <Route path="/printers/orders" element={<AppLayout><Orders /></AppLayout>} />
                      <Route path="/printers/products" element={<AppLayout><Products /></AppLayout>} />
                      <Route path="/printers/categories" element={<AppLayout><Categories /></AppLayout>} />
                      <Route path="/printers/printer-types" element={<AppLayout><PrinterTypes /></AppLayout>} />
                      <Route path="/printers/customers" element={<AppLayout><Customers /></AppLayout>} />
                      <Route path="/printers/payments" element={<AppLayout><Payments /></AppLayout>} />
                      <Route path="/printers/reports" element={<AppLayout><Reports /></AppLayout>} />
                      <Route path="/printers/settings" element={<AppLayout><Settings /></AppLayout>} />

                    </Routes>
                  </SidebarProvider>
                </NotificationProvider>
              </OrderProvider>
            </WalletProvider>
          </WishlistProvider>
        </CartProvider>
      </UserProvider >
    </Router >
  );
};

export default AppRoutes;
