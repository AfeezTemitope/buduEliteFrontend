"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useEcommerceStore } from "./useEcommerceStore.ts"

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, updateCartQuantity, checkout, cartLoading } = useEcommerceStore()

    const total = cartItems.reduce((sum, item) => sum + Number.parseFloat(item.product.price) * item.quantity, 0)

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-700 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-700">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <ShoppingBag className="w-5 h-5 mr-2" />
                                    Cart ({cartItems.length})
                                </h2>
                                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {cartItems.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400">Your cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                className="flex items-center space-x-3 p-3 bg-black/30 border border-gray-700 rounded-lg"
                                            >
                                                <img
                                                    src={item.product.image_url || "/placeholder.svg?height=60&width=60"}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-white text-sm truncate">{item.product.name}</h4>
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
                                                        ${(Number.parseFloat(item.product.price) * item.quantity).toFixed(2)}
                                                    </p>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {cartItems.length > 0 && (
                                <div className="border-t border-gray-700 p-6 space-y-4">
                                    <div className="flex items-center justify-between text-lg font-bold text-white">
                                        <span>Total:</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={checkout}
                                        disabled={cartLoading}
                                        className="w-full py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-black font-semibold rounded-lg hover:from-lime-500 hover:to-lime-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {cartLoading ? "Processing..." : "Checkout"}
                                    </motion.button>

                                    <button onClick={onClose} className="w-full py-2 text-gray-400 hover:text-white transition-colors">
                                        Continue Shopping
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default CartDrawer
