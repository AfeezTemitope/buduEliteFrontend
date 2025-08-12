import { create } from "zustand";
import axios from "axios";

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

interface ContentHubState {
    posts: Post[];
    selectedPost: Post | null;
    loading: boolean;
    fetchPosts: () => Promise<void>;
    fetchPost: (postId: number) => Promise<void>;
    likePost: (postId: number) => Promise<void>;
    sharePost: (postId: number) => Promise<void>;
    setSelectedPost: (post: Post | null) => void;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api";

export const useContentHubStore = create<ContentHubState>((set, get) => ({
    posts: [],
    selectedPost: null,
    loading: false,

    fetchPosts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get<Post[]>(`${API_BASE_URL}/content-hub/posts/`);
            set({ posts: response.data });
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            set({ loading: false });
        }
    },

    fetchPost: async (postId: number) => {
        try {
            const response = await axios.get<Post>(`${API_BASE_URL}/content-hub/posts/${postId}/`);
            set({ selectedPost: response.data });
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    },

    likePost: async (postId: number) => {
        try {
            const response = await axios.post<{ message: string; post: Post }>(
                `${API_BASE_URL}/content-hub/posts/${postId}/like/`
            );

            const updatedPost = response.data.post;

            set((state) => ({
                posts: state.posts.map((post) =>
                    post.id === postId ? { ...post, ...updatedPost } : post
                ),
                selectedPost:
                    state.selectedPost?.id === postId ? { ...state.selectedPost, ...updatedPost } : state.selectedPost,
            }));
        } catch (error) {
            console.error("Error liking post:", error);
        }
    },

    sharePost: async (postId: number) => {
        try {
            const response = await axios.post<{ message: string; post: Post }>(
                `${API_BASE_URL}/content-hub/posts/${postId}/share/`
            );

            const updatedPost = response.data.post;

            set((state) => ({
                posts: state.posts.map((post) =>
                    post.id === postId ? { ...post, ...updatedPost } : post
                ),
                selectedPost:
                    state.selectedPost?.id === postId ? { ...state.selectedPost, ...updatedPost } : state.selectedPost,
            }));
        } catch (error) {
            console.error("Error sharing post:", error);
        }
    },

    setSelectedPost: (post) => set({ selectedPost: post }),
}));