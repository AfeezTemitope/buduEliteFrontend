import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import toast from 'react-hot-toast';
import { useContentHubStore, Post } from "../store";

interface BefaNewsProps {
    onNavigate?: (page: string) => void;
}

/**
 * Universal share utility that works on both web and mobile devices
 */
interface ShareData {
    title: string;
    text: string;
    url: string;
}

const isWebShareSupported = (): boolean => {
    return typeof navigator !== 'undefined' && 'share' in navigator;
};

const shareContent = async (data: ShareData): Promise<boolean> => {
    try {
        // Use Web Share API if available (primarily on mobile)
        if (isWebShareSupported()) {
            await navigator.share(data);
            return true;
        }

        // Fallback to clipboard for web browsers
        const shareText = `${data.title}\n\n${data.text}\n\n${data.url}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareText);
            return true;
        }

        // Final fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }

    } catch (error) {
        console.error('Share failed:', error);
        return false;
    }
};

const generatePostShareData = (post: Post): ShareData => {
    const baseUrl = window.location.origin;
    const postUrl = `${baseUrl}#post-${post.id}`;

    return {
        title: `BEFA News - ${post.author.username}`,
        text: post.description.length > 100
            ? `${post.description.substring(0, 100)}...`
            : post.description,
        url: postUrl
    };
};

const PostDetail = ({ post, onBack, handleShare, formatDate }: {
    post: Post;
    onBack: () => void;
    handleShare: (postId: number) => void;
    formatDate: (dateString: string) => string;
}) => (
    <div>
        <button
            onClick={onBack}
            className="mb-6 flex items-center text-lime-400 hover:text-lime-300 transition-colors"
        >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to BEFA News
        </button>
        <div className="bg-gray-900 border border-lime-400/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold">
                        {post.author.username.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div>
                    <p className="text-white font-medium">{post.author.username}</p>
                    <p className="text-gray-400 text-sm">{formatDate(post.created_at)}</p>
                </div>
            </div>

            <img
                src={post.image_url}
                alt={post.description}
                loading="lazy"
                className="w-full h-64 object-contain bg-gray-800 rounded-lg mb-4"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "/drilldown.png";
                }}
            />

            <p className="text-gray-300 mb-6 leading-relaxed">{post.description}</p>

            <div className="flex items-center space-x-4">
                <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-lime-400 transition-colors"
                >
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">
                        {isWebShareSupported() ? 'Share' : 'Copy Link'} ({post.share_count ?? 0})
                    </span>
                </button>
            </div>
        </div>
    </div>
);

const BefaNews: React.FC<BefaNewsProps> = () => {
    const { posts, loading, fetchPosts, sharePost, selectedPost, setSelectedPost } = useContentHubStore();
    const [localPosts, setLocalPosts] = useState(posts);
    const [fetchFailed, setFetchFailed] = useState(false);
    const [expandedPost, setExpandedPost] = useState<number | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        fetchPosts().catch(() => setFetchFailed(true));
    }, [fetchPosts]);

    useEffect(() => {
        setLocalPosts(posts);
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

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const handleShare = async (postId: number) => {
        try {
            const post = localPosts.find(p => p.id === postId) || selectedPost;
            if (!post) return;

            const shareData = generatePostShareData(post);
            const success = await shareContent(shareData);

            if (success) {
                await sharePost(postId);
                toast.success(
                    isWebShareSupported()
                        ? 'Post shared successfully!'
                        : 'Link copied to clipboard!',
                    {
                        style: {
                            background: '#1f2937',
                            color: '#ffffff',
                            border: '1px solid #a3e635',
                        },
                    }
                );
            } else {
                toast.error('Failed to share post', {
                    style: {
                        background: '#1f2937',
                        color: '#ffffff',
                        border: '1px solid #ef4444',
                    },
                });
            }
        } catch (error) {
            console.error("Failed to share post:", error);
            toast.error('Failed to share post', {
                style: {
                    background: '#1f2937',
                    color: '#ffffff',
                    border: '1px solid #ef4444',
                },
            });
        }
    };

    if (loading && localPosts.length === 0) {
        return <div className="min-h-screen bg-gray-900/50 pt-20 pb-8">{/* Skeleton loader */}</div>;
    }

    if (fetchFailed && localPosts.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900/50 pt-20 pb-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📡</div>
                    <p className="text-gray-400">Checking for updates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900/50 pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {selectedPost ? (
                    <PostDetail
                        post={selectedPost}
                        onBack={() => setSelectedPost(null)}
                        handleShare={handleShare}
                        formatDate={formatDate}
                    />
                ) : (
                    <>
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-white">BEFA News</h1>
                            <p className="text-gray-400 text-sm">Latest updates from the BEFA community</p>
                        </div>

                        {/* Posts Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {localPosts.map((post, index) => (
                                <div
                                    key={post.id}
                                    ref={index === localPosts.length - 1 ? lastPostRef : null}
                                    className="bg-black/20 rounded-lg overflow-hidden cursor-pointer"
                                    onClick={() => setSelectedPost(post)}
                                >
                                    {/* Author */}
                                    <div className="p-4 pb-2">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
                                                <span className="text-black font-semibold text-sm">
                                                    {post.author.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">{post.author.username}</p>
                                                <p className="text-gray-500 text-xs">{formatDate(post.created_at)}</p>
                                            </div>
                                        </div>

                                        <img
                                            src={post.image_url}
                                            alt={post.description}
                                            loading="lazy"
                                            className="w-full h-48 object-contain bg-gray-800 rounded-lg"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/drilldown.png";
                                            }}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="p-4 pt-2">
                                        <p className="text-gray-300 text-sm line-clamp-3">
                                            {expandedPost === post.id
                                                ? post.description
                                                : post.description.length > 120
                                                    ? `${post.description.slice(0, 120)}...`
                                                    : post.description}
                                        </p>

                                        {/* Share & Read More */}
                                        <div className="flex items-center justify-between mt-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare(post.id);
                                                }}
                                                className="flex items-center space-x-1 text-gray-400 hover:text-lime-400 transition-colors"
                                            >
                                                <Share2 className="w-4 h-4" />
                                                <span className="text-xs font-medium">
                                                    {isWebShareSupported() ? 'Share' : 'Copy Link'} ({post.share_count ?? 0})
                                                </span>
                                            </button>

                                            {post.description.length > 120 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setExpandedPost(expandedPost === post.id ? null : post.id);
                                                    }}
                                                    className="text-lime-400 hover:text-lime-300 text-xs font-medium"
                                                >
                                                    {expandedPost === post.id ? "Read Less" : "Read More"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {fetchFailed && localPosts.length > 0 && (
                            <div className="text-center py-6">
                                <p className="text-gray-500 text-sm">Some updates couldn’t be loaded</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BefaNews;