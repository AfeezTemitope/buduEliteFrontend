"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw, ExternalLink, Clock } from "lucide-react"

interface NewsItem {
    id: string
    title: string
    description: string
    publishedAt: string
    source: string
    category: string
    url?: string
}

const FootballNews: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)

    const fetchFootballNews = async () => {
        setLoading(true)
        try {
            const mockNews: NewsItem[] = [
                {
                    id: "1",
                    title: "Premier League Transfer Window: Latest Updates",
                    description: "Manchester United close to signing new midfielder as Arsenal eye striker...",
                    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    source: "Sky Sports",
                    category: "Transfers",
                    url: "https://example.com/news/1",
                },
                {
                    id: "2",
                    title: "Champions League Quarter-Final Draw Results",
                    description: "The draw for the Champions League quarter-finals has been completed with some exciting matchups...",
                    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    source: "UEFA.com",
                    category: "Champions League",
                    url: "https://example.com/news/2",
                },
                {
                    id: "3",
                    title: "World Cup Qualifiers: Nigeria vs Ghana Preview",
                    description: "Two West African giants clash in a crucial World Cup qualifier match...",
                    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                    source: "BBC Sport",
                    category: "International",
                    url: "https://example.com/news/3",
                },
            ]

            await new Promise((resolve) => setTimeout(resolve, 1000))
            setNews(mockNews)
        } catch (error) {
            console.error("Error fetching football news:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFootballNews()
        const interval = setInterval(fetchFootballNews, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const formatTimeAgo = (dateString: string) => {
        const now = new Date()
        const publishedDate = new Date(dateString)
        const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return "Just now"
        if (diffInHours === 1) return "1 hour ago"
        if (diffInHours < 24) return `${diffInHours} hours ago`

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays === 1) return "1 day ago"
        return `${diffInDays} days ago`
    }

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between mb-6"
            >
                <h2 className="text-xl font-bold text-white flex items-center">
                    <div className="w-2 h-2 bg-lime-400 rounded-full mr-3 animate-pulse" />
                    Football News
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchFootballNews}
                    disabled={loading}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </motion.button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[28rem] overflow-y-auto">
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-black/30 border border-gray-700 rounded-lg p-4 animate-pulse">
                            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                        </div>
                    ))
                    : news.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="bg-black/30 border border-gray-700 rounded-lg p-4 hover:border-lime-400/30 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-lime-400 transition-colors">
                                    {item.title}
                                </h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-lime-400/20 text-lime-400 whitespace-nowrap ml-2">
                    {item.category}
                  </span>
                            </div>

                            <p className="text-gray-400 text-xs mb-3 line-clamp-2">{item.description}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(item.publishedAt)}</span>
                    </span>
                                    <span>•</span>
                                    <span>{item.source}</span>
                                </div>

                                {item.url && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.open(item.url, "_blank")
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-lime-400 hover:text-lime-300"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ))}
            </div>
        </div>
    )
}

export default FootballNews
