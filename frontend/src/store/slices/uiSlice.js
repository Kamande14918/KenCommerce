import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Mobile menu
  mobileMenuOpen: false,
  
  // Search
  searchModalOpen: false,
  
  // Theme
  darkMode: localStorage.getItem('kencommerce_theme') === 'dark',
  
  // Notifications
  notifications: [],
  
  // Loading states
  globalLoading: false,
  
  // Modals
  modals: {
    auth: false,
    quickView: false,
    wishlist: false,
    compare: false,
  },
  
  // Sidebar
  sidebarOpen: false,
  
  // Filters (mobile)
  filtersOpen: false,
  
  // Toast notifications
  toasts: [],
  
  // Page transitions
  pageTransition: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Mobile menu
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false
    },
    
    // Search modal
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen
    },
    
    openSearchModal: (state) => {
      state.searchModalOpen = true
    },
    
    closeSearchModal: (state) => {
      state.searchModalOpen = false
    },
    
    // Theme
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('kencommerce_theme', state.darkMode ? 'dark' : 'light')
    },
    
    setDarkMode: (state, action) => {
      state.darkMode = action.payload
      localStorage.setItem('kencommerce_theme', action.payload ? 'dark' : 'light')
    },
    
    // Global loading
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    },
    
    // Modals
    openModal: (state, action) => {
      const modalName = action.payload
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true
      }
    },
    
    closeModal: (state, action) => {
      const modalName = action.payload
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false
      })
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    openSidebar: (state) => {
      state.sidebarOpen = true
    },
    
    closeSidebar: (state) => {
      state.sidebarOpen = false
    },
    
    // Filters (mobile)
    toggleFilters: (state) => {
      state.filtersOpen = !state.filtersOpen
    },
    
    openFilters: (state) => {
      state.filtersOpen = true
    },
    
    closeFilters: (state) => {
      state.filtersOpen = false
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        ...action.payload,
      }
      state.notifications.unshift(notification)
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(
        notification => notification.id === action.payload
      )
      if (notification) {
        notification.read = true
      }
    },
    
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    // Toast notifications
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        ...action.payload,
      }
      state.toasts.push(toast)
    },
    
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
    },
    
    clearToasts: (state) => {
      state.toasts = []
    },
    
    // Page transitions
    startPageTransition: (state) => {
      state.pageTransition = true
    },
    
    endPageTransition: (state) => {
      state.pageTransition = false
    },
  },
})

export const {
  toggleMobileMenu,
  closeMobileMenu,
  toggleSearchModal,
  openSearchModal,
  closeSearchModal,
  toggleDarkMode,
  setDarkMode,
  setGlobalLoading,
  openModal,
  closeModal,
  closeAllModals,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  toggleFilters,
  openFilters,
  closeFilters,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  addToast,
  removeToast,
  clearToasts,
  startPageTransition,
  endPageTransition,
} = uiSlice.actions

// Selectors
export const selectUI = (state) => state.ui
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen
export const selectSearchModalOpen = (state) => state.ui.searchModalOpen
export const selectDarkMode = (state) => state.ui.darkMode
export const selectGlobalLoading = (state) => state.ui.globalLoading
export const selectModals = (state) => state.ui.modals
export const selectModalOpen = (modalName) => (state) => state.ui.modals[modalName]
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectFiltersOpen = (state) => state.ui.filtersOpen
export const selectNotifications = (state) => state.ui.notifications
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.filter(notification => !notification.read)
export const selectToasts = (state) => state.ui.toasts
export const selectPageTransition = (state) => state.ui.pageTransition

export default uiSlice.reducer
