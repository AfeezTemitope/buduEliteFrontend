import React, { useEffect, useState, useRef, useCallback } from "react";
import { Heart, Share2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from "../store";
import { useContentHubStore, Post } from "../store";

const BefaNews: React.FC = () => {
    const { isAuthenticated } = useAuthStore();
    const {
        posts,
        selectedPost,
        loading,
        fetchPosts,
        likePost,
        setSelectedPost,
    } = useContentHubStore();

    const [localPosts, setLocalPosts] = useState<Post[]>([]);
    const [fetchFailed, setFetchFailed] = useState(false);
    const [expandedPost, setExpandedPost] = useState<number | null>(null);
    const [showFullPost, setShowFullPost] = useState<Post | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const POST_URL = (id: number) => `${window.location.origin}/befa-news/${id}`;

    // Sync posts from backend
    useEffect(() => {
        if (posts.length > 0) {
            const postsWithShare = posts.map((post) => ({
                ...post,
                share_count: post.share_count !== undefined ? post.share_count : 0,
            }));
            setLocalPosts(postsWithShare);
            setFetchFailed(false);
        }
    }, [posts]);

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading || fetchFailed || !node) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    fetchPosts().catch(() => setFetchFailed(true));
                }
            });
            observer.current.observe(node);
        },
        [loading, fetchFailed, fetchPosts]
    );

    useEffect(() => {
        if (isAuthenticated && localPosts.length === 0) {
            fetchPosts().catch(() => setFetchFailed(true));
        }
    }, [isAuthenticated, localPosts.length, fetchPosts]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleLike = (postId: number) => {
        const post = localPosts.find((p) => p.id === postId);
        if (!post) return;

        const newIsLiked = !post.is_liked;
        const delta = newIsLiked ? 1 : -1;

        // Optimistic update
        setLocalPosts((prev) =>
            prev.map((p) =>
                p.id === postId
                    ? { ...p, is_liked: newIsLiked, like_count: p.like_count + delta }
                    : p
            )
        );

        // Sync with backend
        likePost(postId).catch(() => {
            // Revert on failure
            setLocalPosts((prev) =>
                prev.map((p) =>
                    p.id === postId
                        ? { ...p, is_liked: !newIsLiked, like_count: p.like_count - delta }
                        : p
                )
            );
        });
    };

    const handleShare = async (post: Post) => {
        const url = POST_URL(post.id);
        const title = `Check out: ${post.description.slice(0, 50)}...`;

        try {
            if (navigator.share) {
                await navigator.share({ title, url });
            } else {
                await navigator.clipboard.writeText(url);
                console.log("Link copied");
            }

            // Update frontend share count
            setLocalPosts((prev) =>
                prev.map((p) =>
                    p.id === post.id
                        ? { ...p, share_count: (p.share_count || 0) + 1 }
                        : p
                )
            );
        } catch (err) {
            console.log("Share canceled or failed", err);
        }
    };

    const handlePostClick = (post: Post) => {
        setShowFullPost(post);
    };

    const handleReadMore = (e: React.MouseEvent, post: Post) => {
        e.stopPropagation();
        setShowFullPost(post);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-20 px-4">
                <p className="text-center">Please log in to view BEFA News.</p>
            </div>
        );
    }

    // Full Post View
    if (showFullPost) {
        return (
            <div className="min-h-screen bg-gray-900/50 pt-16 sm:pt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setShowFullPost(null)}
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Back to News</span>
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold text-white">BEFA News</h1>
                    </div>

                    {/* Full Post Content */}
                    <div className="bg-black/20 rounded-lg overflow-hidden">
                        {/* Author Info */}
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-lime-400 rounded-full flex items-center justify-center">
                                    <span className="text-black font-semibold text-sm sm:text-base">
                                        {showFullPost.author.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white text-sm sm:text-base font-medium">{showFullPost.author.username}</p>
                                    <p className="text-gray-500 text-xs sm:text-sm">{formatDate(showFullPost.created_at)}</p>
                                </div>
                            </div>

                            {/* Image */}
                            <div className="mb-4 sm:mb-6">
                                <img
                                    src={showFullPost.image_url || "/placeholder.svg"}
                                    alt={showFullPost.description}
                                    loading="lazy"
                                    className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-contain bg-gray-800 rounded-lg"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/drilldown.png";
                                    }}
                                />
                            </div>

                            {/* Full Description */}
                            <div className="mb-6">
                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                    {showFullPost.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-6 pt-4 border-t border-gray-700">
                                <button
                                    onClick={() => handleLike(showFullPost.id)}
                                    className="flex items-center space-x-2 text-gray-300 hover:text-lime-400 transition-colors"
                                >
                                    <Heart
                                        className={`w-5 h-5 sm:w-6 sm:h-6 ${showFullPost.is_liked ? "fill-lime-400 scale-110" : ""} transition-transform`}
                                    />
                                    <span className="font-medium text-sm sm:text-base">{showFullPost.like_count} likes</span>
                                </button>

                                <button
                                    onClick={() => handleShare(showFullPost)}
                                    className="flex items-center space-x-2 text-gray-300 hover:text-lime-400 transition-colors"
                                >
                                    <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <span className="font-medium text-sm sm:text-base">{showFullPost.share_count || 0} shares</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900/50 pt-16 sm:pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">BEFA News</h1>
                    <p className="text-gray-400 text-sm">Latest updates from the BEFA community</p>
                </div>

                {/* Loading */}
                {loading && localPosts.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-black/20 rounded-lg overflow-hidden">
                                <div className="w-full h-40 sm:h-48 bg-gray-700"></div>
                                <div className="p-3 sm:p-4 space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded-full"></div>
                                        <div className="h-3 sm:h-4 bg-gray-600 rounded w-1/3"></div>
                                    </div>
                                    <div className="h-3 sm:h-4 bg-gray-600 rounded w-full"></div>
                                    <div className="h-2 sm:h-3 bg-gray-600 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : fetchFailed && localPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-4xl sm:text-6xl mb-4">📡</div>
                        <p className="text-gray-400">Checking for updates...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {localPosts.map((post, index) => (
                                <div
                                    key={post.id}
                                    ref={index === localPosts.length - 1 ? lastPostRef : null}
                                    className="bg-black/20 rounded-lg overflow-hidden cursor-pointer group hover:bg-black/30 transition-colors"
                                    onClick={() => handlePostClick(post)}
                                >
                                    <div className="p-3 sm:p-4 pb-2">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-lime-400 rounded-full flex items-center justify-center">
                                                <span className="text-black font-semibold text-xs sm:text-sm">
                                                    {post.author.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-white text-xs sm:text-sm font-medium">{post.author.username}</p>
                                                <p className="text-gray-500 text-xs">{formatDate(post.created_at)}</p>
                                            </div>
                                        </div>

                                        <img
                                            src={post.image_url || "/placeholder.svg"}
                                            alt={post.description}
                                            loading="lazy"
                                            className="w-full h-32 sm:h-40 md:h-48 object-contain bg-gray-800 rounded-lg"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/drilldown.png";
                                            }}
                                        />
                                    </div>

                                    <div className="p-3 sm:p-4 pt-2">
                                        <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 mb-3">
                                            {post.description.length > 100
                                                ? `${post.description.slice(0, 100)}...`
                                                : post.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3 sm:space-x-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLike(post.id);
                                                    }}
                                                    className="flex items-center space-x-1 text-gray-400 hover:text-lime-400 transition-colors"
                                                >
                                                    <Heart
                                                        className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
                                                            post.is_liked ? "fill-lime-400 scale-110" : ""
                                                        }`}
                                                    />
                                                    <span className="text-xs font-medium">{post.like_count}</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShare(post);
                                                    }}
                                                    className="flex items-center space-x-1 text-gray-400 hover:text-lime-400 transition-colors"
                                                >
                                                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4 hover:scale-110 transition-transform" />
                                                    <span className="text-xs font-medium">{post.share_count || 0}</span>
                                                </button>
                                            </div>

                                            {post.description.length > 100 && (
                                                <button
                                                    onClick={(e) => handleReadMore(e, post)}
                                                    className="text-lime-400 hover:text-lime-300 text-xs font-medium"
                                                >
                                                    Read More
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {fetchFailed && localPosts.length > 0 && (
                            <div className="text-center py-6">
                                <div className="text-2xl sm:text-4xl mb-2">📡</div>
                                <p className="text-gray-500 text-sm">Some updates couldn't be loaded</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BefaNews;
