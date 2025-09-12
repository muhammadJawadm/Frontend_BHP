import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/Home";
import SellerLogin from "./pages/auth/SellerLogin";
import SellerSignup from "./pages/auth/SellerSignup";
import SellerSignupStep2 from "./pages/auth/CreateStore";
import CustomerLogin from "./pages/auth/CustomerLogin";
import CustomerSignup from "./pages/auth/CustomerSignup";
import Dashboard from "./pages/seller/Dashboard";
import { AuthProvider } from './context/AuthContext';
import AddProduct from "./pages/seller/AddProduct";
import ViewStore from "./pages/viewStore";
import CreateStore from "./pages/auth/CreateStore";
import ViewProduct from "./pages/productsDetail";
import OrderDetails from "./pages/seller/OrderDetail";
import MyOrder from "./pages/customer/MyOrders";
import ProductByCategory from "./pages/customer/ProductByCategory";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ShippingForm from "./pages/checkout/ShippingForm";
import PrivacyPolicy from "./pages/customer/PrivacyPolicy";
import TermsOfService from "./pages/customer/TermsOfService";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>  
        <Routes>
          <Route path="/" element={<Home />} />
      <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/signup" element={<CustomerSignup />} />
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/signup" element={<SellerSignup />} />
          <Route path="/seller/CreateStore" element={<CreateStore />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/addproduct/:storeId" element={<AddProduct />} />
          <Route path="/dashboard/store/:storeId" element={<ViewStore />} />
          <Route path="/viewproduct/:productId" element={<ViewProduct />} />
          <Route path="/orders/:storeId" element={<OrderDetails />} />
          <Route path="/MyOrders/:id" element={<MyOrder />} />
          <Route path="/products/category/:category" element={<ProductByCategory />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          {/* <Route path="/Shipping" element={<ShippingForm />} /> */}

        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;