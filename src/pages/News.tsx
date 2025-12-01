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

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900/50 pt-20 pb-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Detail view
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-900/50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 flex items-center text-lime-400 hover:text-lime-300 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">Back to BEFA News</span>
          </button>

          {/* Hero Image */}
          <div className="mb-8 overflow-hidden rounded-xl bg-gray-800 border border-gray-700 shadow-lg">
            <img
              src={selectedPost.image_url || "/drilldown.png"}
              alt="Post content"
              className="w-full h-auto max-h-[500px] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/drilldown.png";
              }}
            />
          </div>

          {/* Author & Date */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-sm">
                {selectedPost.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{selectedPost.author.username}</p>
              <p className="text-gray-400 text-sm">{formatDate(selectedPost.created_at).simple}</p>
            </div>
          </div>

          {/* Rich Description */}
          <article
            className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedPost.description }}
          />

          {/* Share Button */}
          <div className="mt-10 pt-6 border-t border-gray-800">
            <button
              onClick={() => handleShare(selectedPost)}
              className="flex items-center space-x-2 text-gray-300 hover:text-lime-400 transition-colors group"
            >
              <Share2 className="w-5 h-5 group-hover:scale-105 transition-transform" />
              <span className="font-medium">
                {isWebShareSupported() ? "Share this update" : "Copy link"}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-gray-900/50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">BEFA News</h1>
          <p className="text-gray-400 text-sm">Latest updates from the BEFA community</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No news updates available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800/50 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-800/70 transition-all duration-200 border border-gray-700/50 hover:border-lime-400/30"
                onClick={() => setSelectedPost(post)}
              >
                <div className="p-4 pb-2">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-semibold text-xs">
                        {post.author.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{post.author.username}</p>
                      <p className="text-gray-500 text-xs">{formatDate(post.created_at).simple}</p>
                    </div>
                  </div>

                  <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden mb-3">
                    <img
                      src={post.image_url || "/drilldown.png"}
                      alt="Post preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/drilldown.png";
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 pt-1">
                  <div
                    className="text-gray-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        expandedPost === post.id
                          ? post.description
                          : post.description.length > 220
                          ? post.description.substring(0, 220) + '…'
                          : post.description,
                    }}
                  />

                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(post);
                      }}
                      className="flex items-center space-x-1 text-gray-400 hover:text-lime-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        {isWebShareSupported() ? "Share" : "Copy"}
                      </span>
                    </button>

                    {post.description.length > 220 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedPost(expandedPost === post.id ? null : post.id);
                        }}
                        className="text-lime-400 hover:text-lime-300 text-xs font-medium transition-colors"
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