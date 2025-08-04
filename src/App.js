import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SellerLogin from "./pages/auth/SellerLogin";
import SellerSignup from "./pages/auth/SellerSignup";
import SellerSignupStep2 from "./pages/auth/sellerSignUp2";
import CustomerLogin from "./pages/auth/CustomerLogin";
import CustomerSignup from "./pages/auth/CustomerSignup";
import Dashboard from "./pages/seller/Dashboard";
import { AuthProvider } from './components/context/AuthContext';
import AddProduct from "./pages/seller/AddProduct";

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
          <Route path="/seller/signup/step2" element={<SellerSignupStep2 />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/AddProduct" element={<AddProduct />} />

        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;