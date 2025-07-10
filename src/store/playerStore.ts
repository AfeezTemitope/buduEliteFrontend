import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

interface Player {
    id: number;
    name: string;
    position: string;
    team: string;
    image: string;
    goals: number;
    assists: number;
    matches: number;
    rating?: number;
    saves?: number;
    cleanSheets?: number;
    bio?: string;
    achievements?: string[];
    is_player_of_the_month?: boolean;
}

interface PlayerState {
    playerOfTheMonth: Player | null;
    featuredPlayers: Player[];
    loading: boolean;
    error: string | null;
    fetchPlayerOfTheMonth: () => Promise<void>;
    fetchFeaturedPlayers: () => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const usePlayerStore = create<PlayerState>((set) => ({
    playerOfTheMonth: null,
    featuredPlayers: [],
    loading: false,
    error: null,

    fetchPlayerOfTheMonth: async () => {
        const { token } = useAuthStore.getState();
        if (!token) {
            toast.error('Please log in to view Player of the Month');
            set({ loading: false, error: 'Please log in to view Player of the Month' });
            return;
        }
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_BASE_URL}/players/player-of-the-month/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ playerOfTheMonth: response.data, loading: false });
        } catch (error: any) {
            const errorMessage = error.response?.status === 401
                ? 'Please log in to view Player of the Month'
                : error.response?.data?.detail || 'Failed to fetch Player of the Month';
            toast.error(errorMessage);
            set({ error: errorMessage, loading: false });
        }
    },

    fetchFeaturedPlayers: async () => {
        const { token } = useAuthStore.getState();
        if (!token) {
            toast.error('Please log in to view Featured Players');
            set({ loading: false, error: 'Please log in to view Featured Players' });
            return;
        }
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_BASE_URL}/players/featured-players/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ featuredPlayers: response.data, loading: false });
        } catch (error: any) {
            const errorMessage = error.response?.status === 401
                ? 'Please log in to view Featured Players'
                : error.response?.data?.detail || 'Failed to fetch Featured Players';
            toast.error(errorMessage);
            set({ error: errorMessage, loading: false });
        }
    },
}));