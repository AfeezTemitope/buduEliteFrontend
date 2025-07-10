import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, Trophy, Users } from "lucide-react"
import { useAuthStore } from "../store"
import { useEcommerceStore } from "../store"
import DashboardHeader from "../components/layout/DashboardHeader"
import TrainingSchedule from "../components/dashboard/TrainingSchedule"
import FootballNews from "../components/dashboard/FootballNews"
import BefaNews from "./BefaNews"
import BefaStore from "./BefaStore"
import PlayerSpotlight from "./PlayerSpotlight"
import ComingSoon from "./ComingSoon"

const Dashboard: React.FC = () => {
  const { user } = useAuthStore()
  const { fetchCart } = useEcommerceStore()
  const [currentPage, setCurrentPage] = useState("/dashboard")

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const renderPage = () => {
    switch (currentPage) {
      case "/befa-news":
        return <BefaNews onNavigate={handleNavigate} />
      case "/befa-store":
        return <BefaStore onNavigate={handleNavigate} />
      case "/player-spotlight":
        return <PlayerSpotlight onNavigate={handleNavigate} />
      case "/live-stream":
        return (
            <ComingSoon
                onNavigate={handleNavigate}
                title="BEFA Match Live Stream"
                description="Watch live matches and tournaments from the BEFA league"
                features={[
                  "Live HD streaming of all BEFA matches",
                  "Multiple camera angles and replays",
                  "Real-time match statistics and analytics",
                  "Interactive live chat with other fans",
                  "Match highlights and post-game analysis",
                  "Mobile-optimized viewing experience",
                ]}
            />
        )
      case "/top5-leagues":
        return (
            <ComingSoon
                onNavigate={handleNavigate}
                title="Top 5 Leagues Live Stream"
                description="Stream matches from the world's top football leagues"
                features={[
                  "Premier League live matches",
                  "La Liga and Serie A coverage",
                  "Bundesliga and Ligue 1 streams",
                  "Champions League and Europa League",
                  "Match predictions and analysis",
                  "Player performance tracking",
                ]}
            />
        )
      default:
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[{ icon: Trophy, label: "Achievements", value: "12", color: "text-lime-400" },
                      { icon: BarChart3, label: "Performance Score", value: "87%", color: "text-green-400" },
                      { icon: Users, label: "Team Rank", value: "#3", color: "text-purple-400" }]
                        .map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-lime-400/30 transition-all"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                                    className="text-2xl font-bold text-white"
                                >
                                  {stat.value}
                                </motion.div>
                              </div>
                              <p className="text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                  </motion.div>

                  {/* THIS IS THE UPDATED STACKED LAYOUT */}
                  <div className="flex flex-col space-y-8">
                    <motion.div variants={itemVariants}>
                      <TrainingSchedule />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FootballNews />
                    </motion.div>
                  </div>

                  <motion.div
                      variants={itemVariants}
                      className="bg-gradient-to-r from-lime-400/10 to-lime-500/10 border border-lime-400/20 rounded-xl p-8 text-center"
                  >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-block mb-4"
                    >
                      🚀
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">More Features Coming Soon!</h3>
                    <p className="text-gray-400">
                      We're working on exciting new features including live streaming, advanced analytics, video reviews,
                      and much more!
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
        )
    }
  }

  return (
      <>
        <DashboardHeader currentPage={currentPage} onNavigate={handleNavigate} />
        {renderPage()}
      </>
  )
}

export default Dashboard
