import api from './client'

export const register = (payload) => api.post('/auth/register/', payload)
export const login = (payload) => api.post('/auth/login/', payload)
export const getProfile = () => api.get('/auth/profile/')
export const updateProfile = (payload) => api.patch('/auth/profile/', payload)
export const getAddresses = () => api.get('/auth/addresses/')
export const createAddress = (payload) => api.post('/auth/addresses/', payload)
export const updateAddress = (id, payload) => api.patch(`/auth/addresses/${id}/`, payload)
export const deleteAddress = (id) => api.delete(`/auth/addresses/${id}/`)

export const getCategories = () => api.get('/products/categories/')
export const getProducts = (params) => api.get('/products/', { params })
export const getProduct = (slug) => api.get(`/products/${slug}/`)
export const getFeaturedProducts = () => api.get('/products/featured/')
export const createReview = (slug, payload) => api.post(`/products/${slug}/reviews/`, payload)

export const getCart = () => api.get('/orders/cart/')
export const addToCart = (productId, quantity = 1) => api.post('/orders/cart/add/', { product_id: productId, quantity })
export const updateCartItem = (itemId, quantity) => api.patch(`/orders/cart/update/${itemId}/`, { quantity })
export const removeCartItem = (itemId) => api.delete(`/orders/cart/remove/${itemId}/`)
export const clearCart = () => api.delete('/orders/cart/clear/')

export const validateCoupon = (code) => api.post('/orders/coupons/validate/', { code })
export const createOrder = (payload) => api.post('/orders/orders/', payload)
export const getOrderHistory = () => api.get('/orders/orders/history/')
export const getOrder = (id) => api.get(`/orders/orders/${id}/`)

export const createCheckoutSession = (orderId) => api.post(`/payments/checkout/${orderId}/`)
export const verifyPayment = (orderId) => api.get(`/payments/verify/${orderId}/`)

export const admin = {
  getDashboard: () => api.get('/orders/admin/dashboard/'),
  getOrders: (status) => api.get('/orders/admin/orders/', { params: status ? { status } : {} }),
  updateOrderStatus: (id, status) => api.patch(`/orders/admin/orders/${id}/status/`, { status }),
  getProducts: () => api.get('/orders/admin/products/'),
  createProduct: (data) => api.post('/orders/admin/products/', data),
  updateProduct: (id, data) => api.patch(`/orders/admin/products/${id}/`, data),
  deleteProduct: (id) => api.delete(`/orders/admin/products/${id}/`),
  getCategories: () => api.get('/orders/admin/categories/'),
  createCategory: (data) => api.post('/orders/admin/categories/', data),
  getCustomers: () => api.get('/orders/admin/customers/'),
}

export default api
