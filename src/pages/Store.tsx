import React, { useState, useEffect } from "react";
import { ShoppingCart, Star, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useStoreStore } from "../store/storeStore";
import Drawer from "../components/common/Drawer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const Store: React.FC = () => {
  const {
    products,
    cartItems,
    loading,
    cartLoading,
    fetchProducts,
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    checkout,
  } = useStoreStore();

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [fetchProducts, fetchCart]);

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">BEFA Store</h1>
              <p className="text-gray-400">Official BEFA merchandise and equipment</p>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-black font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              View Cart ({cartItems.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 animate-pulse"
              >
                <div className="aspect-square bg-gray-700 rounded mb-4" />
                <div className="h-4 bg-gray-700 rounded mb-2" />
                <div className="h-3 bg-gray-700 rounded mb-4" />
                <div className="h-10 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-lime-400/30 transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-lime-400/20 text-lime-400">
                      {product.size}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-400">4.8</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <p className="text-2xl font-bold text-lime-400 mb-4">${product.price}</p>

                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={cartLoading || !product.in_stock}
                    className="w-full py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-black font-semibold rounded-lg hover:from-lime-500 hover:to-lime-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>
                      {cartLoading
                        ? "Adding..."
                        : product.in_stock
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <Drawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        title={`Cart (${cartItems.length})`}
        footer={
          cartItems.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-lg font-bold text-white">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={checkout}
                disabled={cartLoading}
                className="w-full py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-black font-semibold rounded-lg hover:from-lime-500 hover:to-lime-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cartLoading ? "Processing..." : "Checkout"}
              </button>

              <button
                onClick={() => setCartOpen(false)}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : undefined
        }
      >
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 bg-black/30 border border-gray-700 rounded-lg"
              >
                <img
                  src={item.product.image_url || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-lime-400 text-sm">${item.product.price}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <p className="font-bold text-white text-sm">
                    ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Store;