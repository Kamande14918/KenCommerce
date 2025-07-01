import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineSearch,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineUser,
  HiMenu,
  HiOutlineSun,
  HiOutlineMoon,
  HiX,
} from 'react-icons/hi'

// Redux
import { 
  selectIsAuthenticated, 
  selectUser, 
  logout 
} from '../../store/slices/authSlice'
import { 
  selectCartItemsCount,
  toggleCart 
} from '../../store/slices/cartSlice'
import { 
  toggleMobileMenu,
  toggleDarkMode,
  selectDarkMode,
  openSearchModal 
} from '../../store/slices/uiSlice'

// Components
import SearchModal from '../search/SearchModal'
import UserMenu from './UserMenu'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const cartItemsCount = useSelector(selectCartItemsCount)
  const darkMode = useSelector(selectDarkMode)
  
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false)
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showUserMenu])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
    navigate('/')
  }

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Deals', href: '/deals' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-medium' 
            : 'bg-white dark:bg-gray-900'
        }`}
      >
        <div className="container-custom">
          {/* Top bar */}
          <div className="hidden lg:flex items-center justify-between py-2 text-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
              <span>📞 +254 111 416 178</span>
              <span>✉️ support@kencommerce.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <HiOutlineSun className="w-4 h-4" />
                ) : (
                  <HiOutlineMoon className="w-4 h-4" />
                )}
              </button>
              <span className="text-gray-400">|</span>
              <Link 
                to="/track-order" 
                className="hover:text-primary-600 transition-colors"
              >
                Track Order
              </Link>
              <Link 
                to="/help" 
                className="hover:text-primary-600 transition-colors"
              >
                Help
              </Link>
            </div>
          </div>

          {/* Main header */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold text-primary-600"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="hidden sm:block">KenCommerce</span>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`nav-link ${
                    location.pathname === link.href ? 'active' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <HiOutlineSearch className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Search - Mobile */}
              <button
                onClick={() => dispatch(openSearchModal())}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="Search"
              >
                <HiOutlineSearch className="w-6 h-6" />
              </button>

              {/* Dark mode toggle - Mobile */}
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <HiOutlineSun className="w-6 h-6" />
                ) : (
                  <HiOutlineMoon className="w-6 h-6" />
                )}
              </button>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                  aria-label="Wishlist"
                >
                  <HiOutlineHeart className="w-6 h-6" />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="Shopping cart"
              >
                <HiOutlineShoppingBag className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                  >
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </motion.span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowUserMenu(!showUserMenu)
                    }}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {user?.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="hidden sm:block text-gray-700 dark:text-gray-300">
                      {user?.firstName}
                    </span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <HiOutlineUser className="w-6 h-6" />
                    <span className="hidden sm:block">Sign In</span>
                  </Link>
                )}

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && isAuthenticated && (
                    <UserMenu 
                      user={user} 
                      onLogout={handleLogout}
                      onClose={() => setShowUserMenu(false)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => dispatch(toggleMobileMenu())}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="Toggle mobile menu"
              >
                <HiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal />
    </>
  )
}

export default Header
