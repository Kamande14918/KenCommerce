import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch()

  const checkAuthStatus = useCallback(() => {
    // Check if user is authenticated from localStorage
    const token = localStorage.getItem('kencommerce_token')
    const user = localStorage.getItem('kencommerce_user')
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user)
        dispatch(loginSuccess({ user: parsedUser, token }))
      } catch (error) {
        console.error('Error parsing user data:', error)
        dispatch(logout())
      }
    }
  }, [dispatch])

  const login = useCallback(async (credentials) => {
    dispatch(loginStart())
    try {
      // API call will be implemented here
      // For now, this is a placeholder
      console.log('Login attempt:', credentials)
    } catch (error) {
      dispatch(loginFailure(error.message))
    }
  }, [dispatch])

  const register = useCallback(async (userData) => {
    dispatch(loginStart())
    try {
      // API call will be implemented here
      console.log('Register attempt:', userData)
    } catch (error) {
      dispatch(loginFailure(error.message))
    }
  }, [dispatch])

  const logoutUser = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  return {
    checkAuthStatus,
    login,
    register,
    logout: logoutUser
  }
}
