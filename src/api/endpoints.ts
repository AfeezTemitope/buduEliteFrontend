// Centralized API endpoints configuration
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api";

export const API = {
  // Content Hub endpoints
  contentHub: {
    posts: () => `${BASE_URL}/content-hub/posts/`,
    postDetail: (id: number) => `${BASE_URL}/content-hub/posts/${id}/`,
    likePost: (id: number) => `${BASE_URL}/content-hub/posts/${id}/like/`,
    sharePost: (id: number) => `${BASE_URL}/content-hub/posts/${id}/share/`,
  },

  // Player endpoints
  players: {
    playerOfMonth: () => `${BASE_URL}/players/player-of-the-month/`,
    featured: () => `${BASE_URL}/players/featured-players/`,
  },

  // Schedule endpoints
  schedule: {
    events: () => `${BASE_URL}/schedule/events/`,
  },

  // E-commerce endpoints
  ecommerce: {
    products: () => `${BASE_URL}/ecommerce/products/`,
    productDetail: (id: number) => `${BASE_URL}/ecommerce/products/${id}/`,
    cart: () => `${BASE_URL}/ecommerce/cart/`,
    addToCart: () => `${BASE_URL}/ecommerce/cart/add/`,
    updateCart: (id: number) => `${BASE_URL}/ecommerce/cart/${id}/`,
    removeFromCart: (id: number) => `${BASE_URL}/ecommerce/cart/${id}/`,
    clearCart: () => `${BASE_URL}/ecommerce/cart/clear/`,
    orders: () => `${BASE_URL}/ecommerce/orders/`,
    myOrders: () => `${BASE_URL}/ecommerce/my-orders/`,
  },
};

export default API;