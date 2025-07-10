import { create } from "zustand"
import { useAuthStore } from "./authStore"
import toast from "react-hot-toast"

interface User {
    id: number
    email: string
    username: string
}

export interface Comment {
    id: number
    post: number
    author: User
    text: string
    created_at: string
    like_count: number
    is_liked: boolean
}

export interface Post {
    id: number
    author: User
    description: string
    image_url: string
    created_at: string
    updated_at: string
    like_count: number
    is_liked: boolean
    comments: Comment[]
    comment_count: number
}

interface ContentHubState {
    posts: Post[]
    selectedPost: Post | null
    loading: boolean
    fetchPosts: () => Promise<void>
    fetchPost: (postId: number) => Promise<void>
    addComment: (postId: number, text: string) => Promise<void>
    likePost: (postId: number) => Promise<void>
    likeComment: (commentId: number) => Promise<void>
    connectWebSocket: (postId: number) => void
    disconnectWebSocket: () => void
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api"
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000"

export const useContentHubStore = create<ContentHubState>((set, get) => {
    let ws: WebSocket | null = null

    const reconnectWebSocket = (postId: number, _token: string, retries = 3, delay = 3000) => {
        if (retries <= 0) {
            toast.error("Failed to reconnect to real-time updates")
            return
        }
        setTimeout(() => {
            connectWebSocket(postId)
        }, delay)
    }

    const connectWebSocket = (postId: number) => {
        const { token } = useAuthStore.getState()
        if (!token) {
            toast.error("Please log in to enable real-time updates")
            return
        }

        // Close existing WebSocket if open
        if (ws) {
            ws.close()
            ws = null
        }

        try {
            ws = new WebSocket(`${WS_BASE_URL}/ws/posts/${postId}/?token=${token}`)

            ws.onopen = () => {
                console.log("WebSocket connected for post:", postId)
                toast.success("Connected to real-time updates")
            }

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    if (data.comment) {
                        set((state) => {
                            if (state.selectedPost && state.selectedPost.id === postId) {
                                return {
                                    selectedPost: {
                                        ...state.selectedPost,
                                        comments: [...state.selectedPost.comments, data.comment],
                                        comment_count: state.selectedPost.comment_count + 1,
                                    },
                                }
                            }
                            return state
                        })
                        toast.success("New comment received!")
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error)
                    toast.error("Error receiving real-time update")
                }
            }

            ws.onclose = (event) => {
                console.log("WebSocket disconnected:", event.code, event.reason)
                ws = null
                // Attempt to reconnect
                reconnectWebSocket(postId, token, 2, 3000)
            }

            ws.onerror = (error) => {
                console.error("WebSocket error:", error)
                toast.error("Real-time connection error")
            }
        } catch (error) {
            console.error("Error connecting WebSocket:", error)
            toast.error("Failed to connect to real-time updates")
        }
    }

    return {
        posts: [],
        selectedPost: null,
        loading: false,

        fetchPosts: async () => {
            const { token } = useAuthStore.getState()
            if (!token) {
                toast.error("Please log in to view posts")
                return
            }

            set({ loading: true })
            try {
                const response = await fetch(`${API_BASE_URL}/content-hub/posts/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch posts")
                }

                const data = await response.json()
                set({ posts: data })
            } catch (error) {
                console.error("Error fetching posts:", error)
                toast.error("Failed to load posts")
            } finally {
                set({ loading: false })
            }
        },

        fetchPost: async (postId: number) => {
            const { token } = useAuthStore.getState()
            if (!token) {
                toast.error("Please log in to view post")
                return
            }

            try {
                const response = await fetch(`${API_BASE_URL}/content-hub/posts/${postId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch post")
                }

                const data = await response.json()
                set({ selectedPost: data })
                // Connect WebSocket for real-time comments
                connectWebSocket(postId)
            } catch (error) {
                console.error("Error fetching post:", error)
                toast.error("Failed to load post")
            }
        },

        addComment: async (postId: number, text: string) => {
            const { token } = useAuthStore.getState()
            if (!token) {
                toast.error("Please log in to comment")
                return
            }

            try {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    // Ensure WebSocket message matches backend expectations
                    ws.send(JSON.stringify({ post: postId, text }))
                } else {
                    // Fallback to HTTP
                    const response = await fetch(`${API_BASE_URL}/content-hub/comments/`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ post: postId, text }),
                    })

                    if (!response.ok) {
                        throw new Error("Failed to add comment")
                    }

                    toast.success("Comment added!")
                    await get().fetchPost(postId) // Refresh post to show new comment
                }
            } catch (error) {
                console.error("Error adding comment:", error)
                toast.error("Failed to add comment")
            }
        },

        likePost: async (postId: number) => {
            const { token } = useAuthStore.getState()
            if (!token) {
                toast.error("Please log in to like")
                return
            }

            try {
                const response = await fetch(`${API_BASE_URL}/content-hub/posts/${postId}/like/`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })

                if (!response.ok) {
                    throw new Error("Failed to like post")
                }

                const data = await response.json()
                toast.success(data.message || "Post liked!")
                await get().fetchPosts() // Refresh posts to update like_count/is_liked
            } catch (error) {
                console.error("Error liking post:", error)
                toast.error("Failed to like post")
            }
        },

        likeComment: async (commentId: number) => {
            const { token } = useAuthStore.getState()
            if (!token) {
                toast.error("Please log in to like")
                return
            }

            try {
                const response = await fetch(`${API_BASE_URL}/content-hub/comments/${commentId}/like/`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })

                if (!response.ok) {
                    throw new Error("Failed to like comment")
                }

                const data = await response.json()
                toast.success(data.message || "Comment liked!")

                if (get().selectedPost) {
                    await get().fetchPost(get().selectedPost!.id) // Refresh selected post
                }
            } catch (error) {
                console.error("Error liking comment:", error)
                toast.error("Failed to like comment")
            }
        },

        connectWebSocket,

        disconnectWebSocket: () => {
            if (ws) {
                ws.close()
                ws = null
                console.log("WebSocket manually disconnected")
                toast.success("Disconnected from real-time updates")
            }
        },
    }
})
