import type React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, CheckCircle } from "lucide-react"

interface ComingSoonProps {
    onNavigate: (page: string) => void
    title: string
    description: string
    features: string[]
}

const ComingSoon: React.FC<ComingSoonProps> = ({ onNavigate, title, description, features }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    </div>
                </motion.div>

                <div className="text-center space-y-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-center space-x-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                                <Clock className="w-12 h-12 text-lime-400" />
                            </motion.div>
                            <span className="bg-lime-400/20 text-lime-400 px-4 py-2 rounded-full text-lg font-semibold">
                Coming Soon
              </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white">{title}</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">{description}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">What to Expect</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg"
                                >
                                    <CheckCircle className="w-5 h-5 text-lime-400 flex-shrink-0" />
                                    <span className="text-gray-300">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="bg-lime-400/10 border border-lime-400/20 rounded-xl p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
                        <p className="text-gray-400">
                            We're working hard to bring you these amazing features. Keep checking back for updates!
                        </p>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="text-6xl"
                    >
                        🚀
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon
