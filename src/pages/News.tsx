import React, { useEffect, useState } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { useContentStore, type Post } from "../store/contentStore";
import { formatDate } from "../utils/formatters";
import LoadingSpinner from "../components/common/LoadingSpinner";

const News: React.FC = () => {
  const { posts, loading, fetchPosts, sharePost, selectedPost, setSelectedPost } = useContentStore();
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const isWebShareSupported = (): boolean => {
    return typeof navigator !== "undefined" && "share" in navigator;
  };

  const handleShare = async (post: Post) => {
    try {
      const baseUrl = window.location.origin;
      const postUrl = `${baseUrl}#post-${post.id}`;
      const shareData = {
        title: `BEFA News - ${post.author.username}`,
        text: post.description.length > 100 
          ? `${post.description.substring(0, 100)}...` 
          : post.description,
        url: postUrl,
      };

      if (isWebShareSupported()) {
        await navigator.share(shareData);
      } else {
        const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
      }

      await sharePost(post.id);
      toast.success(isWebShareSupported() ? "Post shared successfully!" : "Link copied to clipboard!");
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900/50 pt-20 pb-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-900/50 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 flex items-center text-lime-400 hover:text-lime-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to BEFA News
          </button>
          <div className="bg-gray-900 border border-lime-400/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold">
                  {selectedPost.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{selectedPost.author.username}</p>
                <p className="text-gray-400 text-sm">{formatDate(selectedPost.created_at).simple}</p>
              </div>
            </div>

            <img
              src={selectedPost.image_url || "/drilldown.png"}
              alt={selectedPost.description}
              className="w-full h-64 object-cover bg-gray-800 rounded-lg mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/drilldown.png";
              }}
            />

            <p className="text-gray-300 mb-6 leading-relaxed">{selectedPost.description}</p>

            <button
              onClick={() => handleShare(selectedPost)}
              className="flex items-center space-x-2 text-gray-300 hover:text-lime-400 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">{isWebShareSupported() ? "Share" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900/50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">BEFA News</h1>
          <p className="text-gray-400 text-sm">Latest updates from the BEFA community</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No news available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-black/20 rounded-lg overflow-hidden cursor-pointer hover:bg-black/30 transition-colors"
                onClick={() => setSelectedPost(post)}
              >
                <div className="p-4 pb-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
                      <span className="text-black font-semibold text-sm">
                        {post.author.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{post.author.username}</p>
                      <p className="text-gray-500 text-xs">{formatDate(post.created_at).simple}</p>
                    </div>
                  </div>

                  <img
                    src={post.image_url || "/drilldown.png"}
                    alt={post.description}
                    className="w-full h-48 object-cover bg-gray-800 rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/drilldown.png";
                    }}
                  />
                </div>

                <div className="p-4 pt-2">
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {expandedPost === post.id
                      ? post.description
                      : post.description.length > 120
                      ? `${post.description.slice(0, 120)}...`
                      : post.description}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(post);
                      }}
                      className="flex items-center space-x-1 text-gray-400 hover:text-lime-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        {isWebShareSupported() ? "Share" : "Copy Link"}
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
        )}
      </div>
    </div>
  );
};

export default News;