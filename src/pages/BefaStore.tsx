import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useEcommerceStore } from "../store"
import ProductCard from "../store/ProducCard.tsx"
import CartDrawer from "../store/CardDrawer.tsx"

interface BefaStoreProps {
    onNavigate: (page: string) => void
}

const BefaStore: React.FC<BefaStoreProps> = ({ onNavigate }) => {
    const { products, loading, fetchProducts } = useEcommerceStore()
    const [cartOpen, setCartOpen] = useState(false)

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <motion.button
                            whileHover={{ scale: 1.1, x: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onNavigate("/dashboard")}
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </motion.button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">BEFA Store</h1>
                            <p className="text-gray-400">Official BEFA merchandise and equipment</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCartOpen(true)}
                            className="ml-auto px-4 py-2 bg-lime-400 hover:bg-lime-500 text-black font-semibold rounded-lg transition-colors"
                        >
                            View Cart
                        </motion.button>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 animate-pulse">
                                <div className="aspect-square bg-gray-700 rounded mb-4"></div>
                                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                <div className="h-3 bg-gray-700 rounded mb-4"></div>
                                <div className="h-10 bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
    )
}

export default BefaStore
