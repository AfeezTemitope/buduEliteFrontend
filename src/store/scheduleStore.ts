import { create } from "zustand";
import API from "../api/endpoints";
import { cache } from "../utils/cache";

export interface Event {
  id: number;
  date: string;
  time: string;
  venue: string;
  jersey_color: string;
  image_url?: string;
  created_at: string;
}

interface ScheduleState {
  events: Event[];
  loading: boolean;
  fetchEvents: () => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  events: [],
  loading: false,

  fetchEvents: async () => {
    // Try cache first
    const cached = await cache.get<Event[]>("schedule", "events");
    if (cached) {
      const sorted = cached.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      set({ events: sorted });
    }

    set({ loading: true });
    try {
      const res = await fetch(API.schedule.events(), {
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) throw new Error("Failed to fetch training schedule");
      
      const data: Event[] = await res.json();
      const sorted = data.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      set({ events: sorted });
      
      // Cache the result
      await cache.set("schedule", "events", sorted);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      set({ loading: false });
    }
  },
}));