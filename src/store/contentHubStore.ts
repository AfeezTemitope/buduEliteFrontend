import { create } from "zustand";
import { useAuthStore } from "./authStore";

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
    setSelectedPost: (post: Post | null) => void;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api";

export const useContentHubStore = create<ContentHubState>((set) => ({
    posts: [],
    selectedPost: null,
    loading: false,

    fetchPosts: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        set({ loading: true });
        try {
            const response = await fetch(`${API_BASE_URL}/content-hub/posts/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch posts");

            const data: Post[] = await response.json();
            set({ posts: data });
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            set({ loading: false });
        }
    },

    fetchPost: async (postId: number) => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/content-hub/posts/${postId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch post");

            const data: Post = await response.json();
            set({ selectedPost: data });
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    },

    likePost: async (postId: number) => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/content-hub/posts/${postId}/like/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to like post");

            const data = await response.json();

            // Optimistically update UI
            set((state) => ({
                posts: state.posts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            is_liked: data.message === "Like added",
                            like_count: data.message === "Like added"
                                ? post.like_count + 1
                                : Math.max(0, post.like_count - 1),
                        }
                        : post
                ),
                selectedPost: state.selectedPost?.id === postId
                    ? {
                        ...state.selectedPost,
                        is_liked: data.message === "Like added",
                        like_count: data.message === "Like added"
                            ? state.selectedPost.like_count + 1
                            : Math.max(0, state.selectedPost.like_count - 1),
                    }
                    : state.selectedPost,
            }));
        } catch (error) {
            console.error("Error liking post:", error);
        }
    },

    setSelectedPost: (post) => set({ selectedPost: post }),
}));