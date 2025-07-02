import { createSlice } from '@reduxjs/toolkit'

// Load cart from localStorage
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('kencommerce_cart')
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    return []
  }
}

const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('kencommerce_cart', JSON.stringify(cartItems))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

const calculateCartTotals = (cartItems) => {
  const itemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax
  
  return {
    itemsCount,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

const initialState = {
  items: getCartFromStorage(),
  ...calculateCartTotals(getCartFromStorage()),
  isOpen: false,
  loading: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      if (!item || !item._id) return;
      const { quantity = 1, variant = null } = item;
      const cartItemId = variant ? `${item._id}-${variant.name}-${variant.value}` : item._id;
      
      const existItem = state.items.find(i => i._id === item._id && (!variant || (i.variant && i.variant.name === variant.name && i.variant.value === variant.value)));
      if (existItem) {
        existItem.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity, variant });
      }
      
      // Recalculate totals
      const totals = calculateCartTotals(state.items)
      Object.assign(state, totals)
      
      // Save to localStorage
      saveCartToStorage(state.items)
    },
    
    removeFromCart: (state, action) => {
      const cartItemId = action.payload
      state.items = state.items.filter(item => item.cartItemId !== cartItemId)
      
      // Recalculate totals
      const totals = calculateCartTotals(state.items)
      Object.assign(state, totals)
      
      // Save to localStorage
      saveCartToStorage(state.items)
    },
    
    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload
      const item = state.items.find(item => item.cartItemId === cartItemId)
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.cartItemId !== cartItemId)
        } else {
          item.quantity = Math.min(quantity, item.maxQuantity)
        }
        
        // Recalculate totals
        const totals = calculateCartTotals(state.items)
        Object.assign(state, totals)
        
        // Save to localStorage
        saveCartToStorage(state.items)
      }
    },
    
    clearCart: (state) => {
      state.items = []
      state.itemsCount = 0
      state.subtotal = 0
      state.tax = 0
      state.total = 0
      
      // Clear localStorage
      localStorage.removeItem('kencommerce_cart')
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    
    openCart: (state) => {
      state.isOpen = true
    },
    
    closeCart: (state) => {
      state.isOpen = false
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    syncCart: (state, action) => {
      // Sync cart with server data (e.g., updated prices, availability)
      const serverItems = action.payload
      
      state.items = state.items.map(cartItem => {
        const serverItem = serverItems.find(item => item._id === cartItem.productId)
        if (serverItem) {
          return {
            ...cartItem,
            price: serverItem.price,
            inStock: serverItem.inStock,
            maxQuantity: serverItem.inventory?.stock || 99,
          }
        }
        return cartItem
      }).filter(item => item.inStock) // Remove out of stock items
      
      // Recalculate totals
      const totals = calculateCartTotals(state.items)
      Object.assign(state, totals)
      
      // Save to localStorage
      saveCartToStorage(state.items)
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  setLoading,
  syncCart,
} = cartSlice.actions

// Alias for compatibility with Cart.jsx
export const updateCartQty = updateQuantity

// Selectors
export const selectCart = (state) => state.cart
export const selectCartItems = (state) => state.cart.items
export const selectCartItemsCount = (state) => state.cart.itemsCount
export const selectCartSubtotal = (state) => state.cart.subtotal
export const selectCartTotal = (state) => state.cart.total
export const selectCartIsOpen = (state) => state.cart.isOpen
export const selectCartLoading = (state) => state.cart.loading

// Check if product is in cart
export const selectIsInCart = (productId, variant = null) => (state) => {
  const cartItemId = variant ? `${productId}-${variant.name}-${variant.value}` : productId
  return state.cart.items.some(item => item.cartItemId === cartItemId)
}

// Get cart item quantity
export const selectCartItemQuantity = (productId, variant = null) => (state) => {
  const cartItemId = variant ? `${productId}-${variant.name}-${variant.value}` : productId
  const item = state.cart.items.find(item => item.cartItemId === cartItemId)
  return item ? item.quantity : 0
}

export default cartSlice.reducer
