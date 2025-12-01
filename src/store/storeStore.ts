import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../api/endpoints";
import { cache } from "../utils/cache";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  size: string;
  in_stock?: boolean | null;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface StoreState {
  products: Product[];
  cartItems: CartItem[];
  loading: boolean;
  cartLoading: boolean;
  fetchProducts: () => Promise<void>;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateCartQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  checkout: () => Promise<void>;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  products: [],
  cartItems: [],
  loading: false,
  cartLoading: false,

  fetchProducts: async () => {
    // Try cache first
    const cached = await cache.getAll<Product>("products");
    if (cached.length > 0) {
      set({ products: cached });
    }

    set({ loading: true });
    try {
      const response = await axios.get(API.ecommerce.products());
      set({ products: response.data });
      
      // Cache products
      for (const product of response.data) {
        await cache.set("products", `product_${product.id}`, product);
      }
    } catch {
      toast.error("Failed to load products");
    } finally {
      set({ loading: false });
    }
  },

  fetchCart: async () => {
    set({ cartLoading: true });
    try {
      const response = await axios.get(API.ecommerce.cart());
      set({ cartItems: response.data });
    } catch {
      toast.error("Failed to load cart");
    } finally {
      set({ cartLoading: false });
    }
  },

  addToCart: async (productId: number) => {
    set({ cartLoading: true });
    try {
      await axios.post(API.ecommerce.addToCart(), { product_id: productId });
      toast.success("Added to cart!");
      await get().fetchCart();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to add to cart");
    } finally {
      set({ cartLoading: false });
    }
  },

  removeFromCart: async (cartItemId: number) => {
    set({ cartLoading: true });
    try {
      await axios.delete(API.ecommerce.removeFromCart(cartItemId));
      toast.success("Removed from cart!");
      await get().fetchCart();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to remove from cart");
    } finally {
      set({ cartLoading: false });
    }
  },

  updateCartQuantity: async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await get().removeFromCart(cartItemId);
      return;
    }
    set({ cartLoading: true });
    try {
      await axios.patch(API.ecommerce.updateCart(cartItemId), { quantity });
      await get().fetchCart();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update cart");
    } finally {
      set({ cartLoading: false });
    }
  },

  checkout: async () => {
    const { cartItems } = get();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    try {
      const response = await axios.post(API.ecommerce.orders(), {
        product_ids: cartItems.map((item) => item.product.id),
      });
      const { whatsapp_url } = response.data;
      if (whatsapp_url) {
        window.open(whatsapp_url, "_blank");
        toast.success("Redirecting to WhatsApp...");
        set({ cartItems: [] });
        await get().fetchCart();
      }
    } catch {
      toast.error("Failed to process checkout");
    }
  },
}));