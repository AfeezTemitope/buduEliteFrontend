"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import ContentHub from "../components/dashboard/ContentHub.tsx"

interface BefaNewsProps {
    onNavigate: (page: string) => void
}

const BefaNews: React.FC<BefaNewsProps> = ({ onNavigate }) => {
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
                            <h1 className="text-3xl font-bold text-white">BEFA News</h1>
                            <p className="text-gray-400">Latest updates from the BEFA community</p>
                        </div>
                    </div>
                </motion.div>

                <ContentHub />
            </div>
        </div>
    )
}

export default BefaNews
