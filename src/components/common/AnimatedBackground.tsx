import type React from "react"
import { motion } from "framer-motion"

const AnimatedBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Multi-layered animated gradient background */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 50%, #000000 0%, #1a1a1a 25%, #000000 50%, #2a2a2a 75%, #000000 100%)",
                        "radial-gradient(circle at 80% 20%, #1a1a1a 0%, #000000 25%, #2a2a2a 50%, #000000 75%, #1a1a1a 100%)",
                        "radial-gradient(circle at 40% 80%, #2a2a2a 0%, #000000 25%, #1a1a1a 50%, #000000 75%, #2a2a2a 100%)",
                        "radial-gradient(circle at 60% 30%, #000000 0%, #2a2a2a 25%, #000000 50%, #1a1a1a 75%, #000000 100%)",
                    ],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />

            {/* Enhanced floating geometric shapes */}
            {Array.from({ length: 35 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        x: [0, Math.random() * 200 - 100, Math.random() * 150 - 75, 0],
                        y: [0, Math.random() * 200 - 100, Math.random() * 150 - 75, 0],
                        rotate: [0, 180, 360],
                        scale: [1, 1.5, 0.8, 1],
                        opacity: [0.1, 0.3, 0.1, 0.2],
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: Math.random() * 5,
                    }}
                >
                    <div
                        className={`${
                            i % 4 === 0
                                ? "w-3 h-3 bg-lime-400 rounded-full"
                                : i % 4 === 1
                                    ? "w-2 h-2 bg-lime-300 rounded-full"
                                    : i % 4 === 2
                                        ? "w-4 h-1 bg-gray-400 rounded-full"
                                        : "w-1 h-4 bg-lime-500 rounded-full"
                        } opacity-20`}
                        style={{
                            boxShadow: "0 0 30px currentColor",
                            filter: "blur(0.5px)",
                        }}
                    />
                </motion.div>
            ))}
        </div>
    )
}

export default AnimatedBackground
