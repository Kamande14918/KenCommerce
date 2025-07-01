import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  featured: [],
  categories: [],
  currentProduct: null,
  searchResults: [],
  filters: {
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    brand: '',
    inStock: false,
    sortBy: 'newest',
  },
  searchQuery: '',
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    
    clearError: (state) => {
      state.error = null
    },
    
    setProducts: (state, action) => {
      state.products = action.payload
      state.loading = false
      state.error = null
    },
    
    setFeaturedProducts: (state, action) => {
      state.featured = action.payload
    },
    
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload
      state.loading = false
      state.error = null
    },
    
    setSearchResults: (state, action) => {
      state.searchResults = action.payload.products
      state.pagination = action.payload.pagination
      state.loading = false
      state.error = null
    },
    
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
    
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    
    addProduct: (state, action) => {
      state.products.unshift(action.payload)
    },
    
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p._id === action.payload._id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
      
      if (state.currentProduct && state.currentProduct._id === action.payload._id) {
        state.currentProduct = action.payload
      }
    },
    
    removeProduct: (state, action) => {
      state.products = state.products.filter(p => p._id !== action.payload)
      
      if (state.currentProduct && state.currentProduct._id === action.payload) {
        state.currentProduct = null
      }
    },
    
    updateProductStock: (state, action) => {
      const { productId, quantity } = action.payload
      
      // Update in products array
      const productIndex = state.products.findIndex(p => p._id === productId)
      if (productIndex !== -1) {
        state.products[productIndex].inventory.stock -= quantity
        if (state.products[productIndex].inventory.stock <= 0) {
          state.products[productIndex].inventory.stockStatus = 'out_of_stock'
          state.products[productIndex].status = 'out_of_stock'
        }
      }
      
      // Update current product
      if (state.currentProduct && state.currentProduct._id === productId) {
        state.currentProduct.inventory.stock -= quantity
        if (state.currentProduct.inventory.stock <= 0) {
          state.currentProduct.inventory.stockStatus = 'out_of_stock'
          state.currentProduct.status = 'out_of_stock'
        }
      }
      
      // Update in search results
      const searchIndex = state.searchResults.findIndex(p => p._id === productId)
      if (searchIndex !== -1) {
        state.searchResults[searchIndex].inventory.stock -= quantity
        if (state.searchResults[searchIndex].inventory.stock <= 0) {
          state.searchResults[searchIndex].inventory.stockStatus = 'out_of_stock'
          state.searchResults[searchIndex].status = 'out_of_stock'
        }
      }
    },
    
    updateProductRating: (state, action) => {
      const { productId, rating } = action.payload
      
      // Update in products array
      const productIndex = state.products.findIndex(p => p._id === productId)
      if (productIndex !== -1) {
        state.products[productIndex].ratings = rating
      }
      
      // Update current product
      if (state.currentProduct && state.currentProduct._id === productId) {
        state.currentProduct.ratings = rating
      }
    },
  },
})

export const {
  setLoading,
  setError,
  clearError,
  setProducts,
  setFeaturedProducts,
  setCategories,
  setCurrentProduct,
  setSearchResults,
  setSearchQuery,
  setFilters,
  resetFilters,
  setPagination,
  addProduct,
  updateProduct,
  removeProduct,
  updateProductStock,
  updateProductRating,
} = productSlice.actions

// Selectors
export const selectProducts = (state) => state.products.products
export const selectFeaturedProducts = (state) => state.products.featured
export const selectCategories = (state) => state.products.categories
export const selectCurrentProduct = (state) => state.products.currentProduct
export const selectSearchResults = (state) => state.products.searchResults
export const selectSearchQuery = (state) => state.products.searchQuery
export const selectFilters = (state) => state.products.filters
export const selectPagination = (state) => state.products.pagination
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error

// Get products by category
export const selectProductsByCategory = (categoryId) => (state) => 
  state.products.products.filter(product => product.category === categoryId)

// Get product by ID
export const selectProductById = (productId) => (state) =>
  state.products.products.find(product => product._id === productId)

// Get filtered products
export const selectFilteredProducts = (state) => {
  const { products, filters } = state.products
  
  return products.filter(product => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false
    }
    
    // Price range filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false
    }
    
    // Rating filter
    if (filters.rating && product.ratings.average < filters.rating) {
      return false
    }
    
    // Brand filter
    if (filters.brand && product.brand !== filters.brand) {
      return false
    }
    
    // In stock filter
    if (filters.inStock && !product.inStock) {
      return false
    }
    
    return true
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.ratings.average - a.ratings.average
      case 'popular':
        return b.soldCount - a.soldCount
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })
}

export default productSlice.reducer
