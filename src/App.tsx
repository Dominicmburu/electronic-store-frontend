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
// import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  return (
    <Router>
      <UserProvider>
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
          <Route path="/track-order" element={<TrackOrder />} />

          {/*  
        <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default AppRoutes;
