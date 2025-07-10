"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Trophy, Users, ArrowRight, Play } from "lucide-react"
import AnimatedBackground from "../components/common/AnimatedBackground"
import AuthModal from "../components/auth/AuthModal"

const LandingPage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <motion.header
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="p-6 lg:p-8"
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
                <div className="w-16 h-12 flex items-center justify-center">
                  <img src="/drilldown.png" alt="BEFA Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-lime-400 text-sm">Budu Elite Football Academy</p>
                </div>
              </motion.div>

              <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-lime-400/25 transition-all"
              >
                Get Started
              </motion.button>
            </div>
          </motion.header>

          {/* Hero Section */}
          <motion.main
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 flex items-center justify-center px-6 lg:px-8"
          >
            <div className="max-w-6xl mx-auto text-center">
              <motion.div variants={itemVariants} className="mb-8">
                <motion.h1
                    className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                    style={{
                      background: "linear-gradient(135deg, #ffffff 0%, #32cd32 50%, #ffffff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                >
                  Budu Elite
                  <motion.span
                      animate={{
                        textShadow: ["0 0 20px #32cd3240", "0 0 40px #32cd3260", "0 0 20px #32cd3240"],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="block text-lime-400"
                  >
                    Football Academy
                  </motion.span>
                </motion.h1>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-12">
                <h2 className="text-xl lg:text-2xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed">
                  This is an academy dedicated to{" "}
                  <span className="text-lime-400 font-semibold">nurturing world-class football talent</span> and
                  developing champions both on and off the field through elite training, mentorship, and cutting-edge
                  technology.
                </h2>
              </motion.div>

              <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
              >
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-8 py-4 bg-gradient-to-r from-lime-400 to-lime-500 text-black font-bold rounded-full text-lg flex items-center space-x-2 hover:shadow-xl hover:shadow-lime-400/25 transition-all"
                >
                  <span>Join the Elite</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-full text-lg flex items-center space-x-2 hover:border-lime-400 hover:text-lime-400 transition-all"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
              >
                {[
                  { icon: Trophy, label: "Champions Trained", value: "500+" },
                  { icon: Star, label: "Elite Coaches", value: "5+" },
                  { icon: Users, label: "Active Players", value: "1200+" },
                  { icon: Trophy, label: "Years of Excellence", value: "5+" },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-lime-400/30 transition-all"
                    >
                      <stat.icon className="w-8 h-8 text-lime-400 mx-auto mb-3" />
                      <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                          className="text-2xl font-bold text-white mb-1"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.main>
        </div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
  )
}

export default LandingPage
