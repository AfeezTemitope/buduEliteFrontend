import { create } from 'zustand';
import axios from 'axios';


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
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_BASE_URL}/players/player-of-the-month/`);
            set({ playerOfTheMonth: response.data, loading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Failed to fetch Player of the Month';
            set({ error: errorMessage, loading: false });
        }
    },

    fetchFeaturedPlayers: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_BASE_URL}/players/featured-players/`);
            set({ featuredPlayers: response.data, loading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Failed to fetch Featured Players';
            set({ error: errorMessage, loading: false });
        }
    },
}));
