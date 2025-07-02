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
import UserNavBar from './UserNavBar'
import AdminNavBar from './AdminNavBar'

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

  // Show AdminNavBar only if logged in and role is 'admin'
  if (user && user.role === 'admin') {
    return <AdminNavBar />;
  }
  // Otherwise, show UserNavBar (for guests and normal users)
  return (
    <div className="relative">
      <UserNavBar />
    </div>
  );
}

export default Header
