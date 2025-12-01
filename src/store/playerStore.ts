import { create } from "zustand";
import axios from "axios";
import API from "../api/endpoints";
import { cache } from "../utils/cache";

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

export const usePlayerStore = create<PlayerState>((set) => ({
  playerOfTheMonth: null,
  featuredPlayers: [],
  loading: false,
  error: null,

  fetchPlayerOfTheMonth: async () => {
    // Try cache first
    const cached = await cache.get<Player>("players", "player_of_month");
    if (cached) {
      set({ playerOfTheMonth: cached });
    }

    set({ loading: true, error: null });
    try {
      const response = await axios.get(API.players.playerOfMonth());
      set({ playerOfTheMonth: response.data, loading: false });
      
      // Cache the result
      await cache.set("players", "player_of_month", response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to fetch Player of the Month";
      set({ error: errorMessage, loading: false });
    }
  },

  fetchFeaturedPlayers: async () => {
    // Try cache first
    const cached = await cache.get<Player[]>("players", "featured");
    if (cached) {
      set({ featuredPlayers: cached });
    }

    set({ loading: true, error: null });
    try {
      const response = await axios.get(API.players.featured());
      set({ featuredPlayers: response.data, loading: false });
      
      // Cache the result
      await cache.set("players", "featured", response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to fetch Featured Players";
      set({ error: errorMessage, loading: false });
    }
  },
}));