import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './components/Sellers/Dashboard';
import ShopList from './Shop/ShopList';
import CreateShop from './Shop/CreateShop';
import EditShop from './Shop/EditShop';
import ProductList from './components/Products/ProductList';
import CreateProduct from './components/Products/CreateProduct';
import EditProduct from './components/Products/EditProduct';
import ProductDetails from './components/Products/ProductDetails';
import SellerProfile from './components/Sellers/Profile';
import './styles/App.css';

function App() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <AuthProvider>
            <Navbar user={user} />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cart" element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    } />
                    <Route path="/payment" element={
                        <ProtectedRoute>
                            <Payment />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={<Dashboard token={token} />} />
                    <Route path="/shop/create" element={<CreateShop token={token} />} />
                    <Route path="/shop/:shopId/edit" element={<EditShop token={token} />} />
                    <Route path="/shop/:shopId/products" element={<ProductList token={token} isOwner={true} />} />
                    <Route path="/product/create" element={<CreateProduct token={token} />} />
                    <Route path="/product/:productId/edit" element={<EditProduct token={token} />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/seller/profile" element={<SellerProfile token={token} user={user} />} />
                </Routes>
            </div>
            <Footer />
        </AuthProvider>
    );
}

export default App;