import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { useAuthStore } from "../../store"
import toast from "react-hot-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  })

  const { login, register, isLoading } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        toast.success("Welcome back! Logged in successfully.")
      } else {
        if (formData.password !== formData.rePassword) {
          toast.error("Passwords do not match")
          return
        }
        await register(formData.username, formData.email, formData.password, formData.rePassword)
        toast.success("Account created and logged in successfully!")
      }
      onClose()
    } catch (error) {
      toast.error(isLogin ? "Login failed. Please check your credentials." : "Registration failed. Please try again.")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
              <motion.div
                  initial={{ scale: 0.7, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, y: 50 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="bg-gray-900 border border-lime-400/20 rounded-2xl p-8 w-full max-w-md relative overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                      onClick={onClose}
                      className="absolute -top-2 -right-2 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center mb-8">
                    <motion.h2
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                      {isLogin ? "Welcome Back" : "Join BEFA"}
                    </motion.h2>
                    <motion.p
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400"
                    >
                      {isLogin ? "Sign in to continue your journey" : "Start your elite football journey"}
                    </motion.p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="relative"
                        >
                          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                              type="text"
                              name="username"
                              placeholder="Username"
                              value={formData.username}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all"
                              required={!isLogin}
                          />
                        </motion.div>
                    )}

                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all"
                          required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-12 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all"
                          required
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {!isLogin && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="relative"
                        >
                          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                              type="password"
                              name="rePassword"
                              placeholder="Confirm Password"
                              value={formData.rePassword}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all"
                              required={!isLogin}
                          />
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-black font-semibold rounded-lg hover:from-lime-500 hover:to-lime-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                    </motion.button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-400">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}
                      <button
                          onClick={() => setIsLogin(!isLogin)}
                          className="ml-2 text-lime-400 hover:text-lime-300 font-medium transition-colors"
                      >
                        {isLogin ? "Sign up" : "Sign in"}
                      </button>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
  )
}

export default AuthModal
