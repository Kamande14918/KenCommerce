import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MobileMenu from './components/layout/MobileMenu'
import Cart from './components/cart/Cart'
import ScrollToTop from './components/common/ScrollToTop'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Category from './pages/Category'
import Search from './pages/Search'
import CartPage from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Profile from './pages/Profile'
import OrderHistory from './pages/OrderHistory'
import OrderDetail from './pages/OrderDetail'
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'

// Admin pages
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
import AdminCategories from './pages/admin/Categories'
import AdminReviews from './pages/admin/Reviews'
import AdminSettings from './pages/admin/Settings'

// Hooks
import { useAuth } from './hooks/useAuth'
import { selectDarkMode } from './store/slices/uiSlice'
import { selectCartIsOpen } from './store/slices/cartSlice'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

function App() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { checkAuthStatus } = useAuth()
  
  const isCartOpen = useSelector(selectCartIsOpen)
  const darkMode = useSelector(selectDarkMode)

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Check if current route is admin
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard - KenCommerce</title>
        </Helmet>
        <AdminRoute>
          <AdminLayout>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Routes location={location}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/reviews" element={<AdminReviews />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </AdminLayout>
        </AdminRoute>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>KenCommerce - Modern eCommerce Platform</title>
        <meta name="description" content="Discover amazing products at unbeatable prices. Shop electronics, fashion, home goods and more at KenCommerce." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <ScrollToTop />
        <Header />
        <MobileMenu />
        
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-screen"
            >
              <Routes location={location}>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/category/:categorySlug" element={<Category />} />
                <Route path="/search" element={<Search />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                
                {/* Protected routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                } />
                <Route path="/orders/:orderId" element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                } />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
        
        <Footer />
        
        {/* Cart Sidebar */}
        {isCartOpen && <Cart />}
      </div>
      <ToastContainer />
    </>
  )
}

export default App
