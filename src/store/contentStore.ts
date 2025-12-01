import { create } from "zustand";
import axios from "axios";
import API from "../api/endpoints";
import { cache } from "../utils/cache";

interface User {
  id: number;
  email: string;
  username: string;
}

export interface Post {
  id: number;
  author: User;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  is_liked: boolean;
  share_count?: number;
}

interface ContentState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  fetchPosts: () => Promise<void>;
  sharePost: (postId: number) => Promise<void>;
  setSelectedPost: (post: Post | null) => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  posts: [],
  selectedPost: null,
  loading: false,

  fetchPosts: async () => {
    // Try cache first
    const cached = await cache.getAll<Post>("posts");
    if (cached.length > 0) {
      set({ posts: cached });
    }

    set({ loading: true });
    try {
      const response = await axios.get<Post[]>(API.contentHub.posts());
      set({ posts: response.data });
      
      // Cache the results
      for (const post of response.data) {
        await cache.set("posts", `post_${post.id}`, post);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      set({ loading: false });
    }
  },

  sharePost: async (postId: number) => {
    try {
      const response = await axios.post<{ message: string; post: Post }>(
        API.contentHub.sharePost(postId)
      );

      const updatedPost = response.data.post;

      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId ? { ...post, ...updatedPost } : post
        ),
        selectedPost:
          state.selectedPost?.id === postId
            ? { ...state.selectedPost, ...updatedPost }
            : state.selectedPost,
      }));

      // Update cache
      await cache.set("posts", `post_${postId}`, updatedPost);
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  },

  setSelectedPost: (post) => set({ selectedPost: post }),
}));