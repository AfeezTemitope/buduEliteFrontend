// import { create } from "zustand";
// import axios from "axios";
// import toast from "react-hot-toast";
//
// export interface Product {
//     id: number;
//     name: string;
//     description: string;
//     price: string;
//     image_url: string;
//     size: string;
//     in_stock?: boolean | null;
// }
//
// export interface CartItem {
//     id: number;
//     product: Product;
//     quantity: number;
// }
//
// interface OrderItem {
//     product: number;
//     quantity: number;
//     product_details?: Product;
// }
//
// export interface Order {
//     id: number;
//     total_amount: string;
//     status: string;
//     created_at: string;
//     items: OrderItem[];
// }
//
// interface EcommerceState {
//     products: Product[];
//     cartItems: CartItem[];
//     orders: Order[];
//     selectedProduct: Product | null;
//     loading: boolean;
//     cartLoading: boolean;
//     ordersLoading: boolean;
//     fetchProducts: () => Promise<void>;
//     fetchCart: () => Promise<void>;
//     fetchOrders: () => Promise<void>;
//     addToCart: (productId: number) => Promise<void>;
//     removeFromCart: (cartItemId: number) => Promise<void>;
//     updateCartQuantity: (cartItemId: number, quantity: number) => Promise<void>;
//     clearCart: () => Promise<void>;
//     viewProductDetails: (productId: number) => Promise<void>;
//     checkout: () => Promise<void>;
// }
//
// const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api";
//
// export const useEcommerceStore = create<EcommerceState>((set, get) => ({
//     products: [],
//     cartItems: [],
//     orders: [],
//     selectedProduct: null,
//     loading: false,
//     cartLoading: false,
//     ordersLoading: false,
//
//     fetchProducts: async () => {
//         set({ loading: true });
//         try {
//             const response = await axios.get(`${API_BASE_URL}/ecommerce/products/`);
//             set({ products: response.data });
//         } catch {
//             toast.error("Failed to load products");
//         } finally {
//             set({ loading: false });
//         }
//     },
//
//     fetchCart: async () => {
//         set({ cartLoading: true });
//         try {
//             const response = await axios.get(`${API_BASE_URL}/ecommerce/cart/`);
//             set({ cartItems: response.data });
//         } catch {
//             toast.error("Failed to load cart");
//         } finally {
//             set({ cartLoading: false });
//         }
//     },
//
//     fetchOrders: async () => {
//         set({ ordersLoading: true });
//         try {
//             const response = await axios.get(`${API_BASE_URL}/ecommerce/my-orders/`);
//             set({ orders: response.data });
//         } catch {
//             toast.error("Failed to load orders");
//         } finally {
//             set({ ordersLoading: false });
//         }
//     },
//
//     addToCart: async (productId: number) => {
//         set({ cartLoading: true });
//         try {
//             await axios.post(`${API_BASE_URL}/ecommerce/cart/add/`, { product_id: productId });
//             toast.success("Added to cart!");
//             await get().fetchCart();
//         } catch (error: any) {
//             toast.error(error.response?.data?.detail || "Failed to add to cart");
//         } finally {
//             set({ cartLoading: false });
//         }
//     },
//
//     removeFromCart: async (cartItemId: number) => {
//         set({ cartLoading: true });
//         try {
//             await axios.delete(`${API_BASE_URL}/ecommerce/cart/${cartItemId}/`);
//             toast.success("Removed from cart!");
//             await get().fetchCart();
//         } catch (error: any) {
//             toast.error(error.response?.data?.detail || "Failed to remove from cart");
//         } finally {
//             set({ cartLoading: false });
//         }
//     },
//
//     updateCartQuantity: async (cartItemId: number, quantity: number) => {
//         if (quantity <= 0) {
//             await get().removeFromCart(cartItemId);
//             return;
//         }
//         set({ cartLoading: true });
//         try {
//             await axios.patch(`${API_BASE_URL}/ecommerce/cart/${cartItemId}/`, { quantity });
//             await get().fetchCart();
//         } catch (error: any) {
//             toast.error(error.response?.data?.detail || "Failed to update cart");
//         } finally {
//             set({ cartLoading: false });
//         }
//     },
//
//     clearCart: async () => {
//         set({ cartLoading: true });
//         try {
//             await axios.delete(`${API_BASE_URL}/ecommerce/cart/clear/`);
//             toast.success("Cart cleared!");
//             await get().fetchCart();
//         } catch (error: any) {
//             toast.error(error.response?.data?.detail || "Failed to clear cart");
//         } finally {
//             set({ cartLoading: false });
//         }
//     },
//
//     viewProductDetails: async (productId: number) => {
//         try {
//             const response = await axios.get(`${API_BASE_URL}/ecommerce/products/${productId}/`);
//             set({ selectedProduct: response.data });
//         } catch {
//             toast.error("Failed to load product details");
//         }
//     },
//
//     checkout: async () => {
//         const { cartItems } = get();
//         if (cartItems.length === 0) {
//             toast.error("Your cart is empty");
//             return;
//         }
//         try {
//             const response = await axios.post(`${API_BASE_URL}/ecommerce/orders/`, {
//                 product_ids: cartItems.map((item) => item.product.id),
//             });
//             const { whatsapp_url } = response.data;
//             if (whatsapp_url) {
//                 window.open(whatsapp_url, "_blank");
//                 toast.success("Redirecting to WhatsApp...");
//                 set({ cartItems: [] });
//                 await get().fetchCart();
//                 await get().fetchOrders();
//             }
//         } catch {
//             toast.error("Failed to process checkout");
//         }
//     },
// }));
