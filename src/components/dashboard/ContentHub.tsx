import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, RefreshCw, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.ts';
import { useContentHubStore } from '../../store/contentHubStore.ts';

interface User {
    id: number;
    email: string;
    username: string;
}

interface Comment {
    id: number;
    post: number;
    author: User;
    text: string;
    created_at: string;
    like_count: number;
    is_liked: boolean;
}

interface Post {
    id: number;
    author: User;
    description: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    like_count: number;
    is_liked: boolean;
    comments: Comment[];
    comment_count: number;
}

const ContentHub: React.FC = () => {
    const { isAuthenticated } = useAuthStore();
    const {
        posts,
        selectedPost,
        loading,
        fetchPosts,
        fetchPost,
        addComment,
        likePost,
        likeComment,
        connectWebSocket,
        disconnectWebSocket
    } = useContentHubStore();
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchPosts();
        }
        return () => disconnectWebSocket();
    }, [isAuthenticated, fetchPosts, disconnectWebSocket]);

    useEffect(() => {
        if (selectedPost) {
            connectWebSocket(selectedPost.id);
        }
        return () => disconnectWebSocket();
    }, [selectedPost, connectWebSocket, disconnectWebSocket]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut'
            }
        },
    };

    const handleCommentSubmit = (postId: number) => {
        if (commentText.trim()) {
            addComment(postId, commentText);
            setCommentText('');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between mb-6"
            >
                <h2 className="text-xl font-bold text-white flex items-center">
                    <MessageCircle className="w-5 h-5 text-lime-400 mr-2" />
                    BEFA Content Hub
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchPosts}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                </motion.button>
            </motion.div>

            <AnimatePresence>
                {loading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="bg-black/30 border border-gray-700 rounded-lg p-4 animate-pulse">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                                        <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                                    </div>
                                </div>
                                <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <motion.div
                        variants={itemVariants}
                        className="text-center py-8"
                    >
                        <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-2">No posts available</p>
                        <p className="text-gray-500 text-sm">Check back later for new content</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {posts.map((post: Post) => (
                            <motion.div
                                key={post.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01, x: 5 }}
                                className="bg-black/30 border border-gray-700 rounded-lg p-4 hover:border-lime-400/30 transition-all"
                            >
                                {/* Post Header */}
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {post.author.username.charAt(0).toUpperCase()}
                    </span>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">{post.author.username}</p>
                                        <p className="text-gray-400 text-sm">{formatDate(post.created_at)}</p>
                                    </div>
                                </div>

                                {/* Post Image */}
                                <motion.img
                                    whileHover={{ scale: 1.02 }}
                                    src={post.image_url}
                                    alt={post.description}
                                    className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer"
                                    onClick={() => fetchPost(post.id)}
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg';
                                    }}
                                />

                                {/* Post Content */}
                                <div className="mb-4">
                                    <p className="text-gray-300">{post.description}</p>
                                </div>

                                {/* Post Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => likePost(post.id)}
                                            className={`flex items-center space-x-2 transition-colors ${
                                                post.is_liked ? 'text-lime-400' : 'text-gray-400 hover:text-lime-400'
                                            }`}
                                        >
                                            <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-lime-400' : ''}`} />
                                            <span className="text-sm font-medium">{post.like_count}</span>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => fetchPost(post.id)}
                                            className="flex items-center space-x-2 text-gray-400 hover:text-lime-400 transition-colors"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            <span className="text-sm font-medium">{post.comment_count}</span>
                                        </motion.button>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => fetchPost(post.id)}
                                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
                                    >
                                        View Details
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Post Detail Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => useContentHubStore.setState({ selectedPost: null })}
                    >
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.7, opacity: 0, y: 50 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="bg-gray-900 border border-lime-400/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {selectedPost.author.username.charAt(0).toUpperCase()}
                    </span>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">{selectedPost.author.username}</p>
                                        <p className="text-gray-400 text-sm">{formatDate(selectedPost.created_at)}</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => useContentHubStore.setState({ selectedPost: null })}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* Post Image */}
                            <img
                                src={selectedPost.image_url}
                                alt={selectedPost.description}
                                className="w-full h-64 object-cover rounded-lg mb-4"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg';
                                }}
                            />

                            {/* Post Description */}
                            <p className="text-gray-300 mb-6">{selectedPost.description}</p>

                            {/* Post Stats */}
                            <div className="flex items-center space-x-6 mb-6 pb-4 border-b border-gray-700">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => likePost(selectedPost.id)}
                                    className={`flex items-center space-x-2 transition-colors ${
                                        selectedPost.is_liked ? 'text-lime-400' : 'text-gray-400 hover:text-lime-400'
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${selectedPost.is_liked ? 'fill-lime-400' : ''}`} />
                                    <span className="font-medium">{selectedPost.like_count} likes</span>
                                </motion.button>
                                <span className="text-gray-400 flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>{selectedPost.comment_count} comments</span>
                </span>
                            </div>

                            {/* Add Comment */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleCommentSubmit(selectedPost.id);
                                            }
                                        }}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleCommentSubmit(selectedPost.id)}
                                        disabled={!commentText.trim()}
                                        className="p-3 bg-lime-400 hover:bg-lime-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black rounded-lg transition-colors"
                                    >
                                        <Send className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Comments */}
                            <div className="space-y-4 max-h-64 overflow-y-auto">
                                {selectedPost.comments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                                ) : (
                                    selectedPost.comments.map((comment: Comment) => (
                                        <motion.div
                                            key={comment.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <div className="w-6 h-6 bg-lime-400 rounded-full flex items-center justify-center">
                              <span className="text-black font-bold text-xs">
                                {comment.author.username.charAt(0).toUpperCase()}
                              </span>
                                                        </div>
                                                        <p className="text-white font-semibold text-sm">{comment.author.username}</p>
                                                        <span className="text-gray-500 text-xs">
                              {formatDate(comment.created_at)}
                            </span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{comment.text}</p>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => likeComment(comment.id)}
                                                    className={`flex items-center space-x-1 ml-4 transition-colors ${
                                                        comment.is_liked ? 'text-lime-400' : 'text-gray-400 hover:text-lime-400'
                                                    }`}
                                                >
                                                    <Heart className={`w-4 h-4 ${comment.is_liked ? 'fill-lime-400' : ''}`} />
                                                    <span className="text-xs">{comment.like_count}</span>
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* API Status Notice */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-lime-400/10 border border-lime-400/20 rounded-lg text-center"
            >
                <p className="text-lime-400 text-sm">
                    🔄 Real-time content updates with WebSocket • Fresh data from API
                </p>
            </motion.div>
        </div>
    );
};

export default ContentHub;