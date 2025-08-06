import type React from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Star } from "lucide-react"
import { useEcommerceStore } from "./index.ts"
import toast from "react-hot-toast"

interface Product {
    id: number
    name: string
    description: string
    price: string
    image_url: string
    size: string
    in_stock?: boolean | null
}

interface ProductCardProps {
    product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart, cartLoading } = useEcommerceStore()

    const handleAddToCart = async () => {
        try {
            await addToCart(product.id)
        } catch (error) {
            toast.error("Failed to add to cart")
        }
    }

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-lime-400/30 transition-all"
        >
            <div className="aspect-square overflow-hidden">
                <img
                    src={product.image_url || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-lime-400/20 text-lime-400">{product.size}</span>
                    <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-400">4.8</span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                <p className="text-2xl font-bold text-lime-400 mb-4">${product.price}</p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    disabled={cartLoading || !product.in_stock}
                    className="w-full py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-black font-semibold rounded-lg hover:from-lime-500 hover:to-lime-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{cartLoading ? "Adding..." : product.in_stock ? "Add to Cart" : "Out of Stock"}</span>
                </motion.button>
            </div>
        </motion.div>
    )
}

export default ProductCard
