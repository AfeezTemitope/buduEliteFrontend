import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

// ===== Types =====
export interface Event {
    id: number;
    date: string;
    time: string;
    venue: string;
    jersey_color: string;
    image_url?: string;
    created_at: string;
}

interface EventStore {
    events: Event[];
    loading: boolean;
    fetchEvents: () => Promise<void>;
}

const BEFA = import.meta.env.VITE_BASE_URL;

// ===== Jersey color mapping =====
const jerseyColorMap: Record<string, string> = {
    BLACK: "#000000",
    BLUE: "#0000FF",
    "BLACK JERSEY": "#000000",
    "BLUE JERSEY": "#0000FF",
};

export const getJerseyColor = (label: string): string => {
    return jerseyColorMap[label.toUpperCase().trim()] || "#9ca3af";
};

// ===== Date & Time formatters =====
export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayMonth: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        full: date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        }),
    };
};

export const formatTime = (timeString: string) => {
    const [h, m] = timeString.split(":");
    const d = new Date();
    d.setHours(parseInt(h, 10), parseInt(m, 10));
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

// ===== Zustand Store with localStorage persistence =====
export const useEventStore = create<EventStore>()(
    persist(
        (set) => ({
            events: [],
            loading: false,
            fetchEvents: async () => {
                set({ loading: true });
                try {
                    const res = await fetch(`${BEFA}/schedule/events/`, {
                        headers: { "Content-Type": "application/json" },
                    });
                    if (!res.ok) throw new Error("Failed to fetch training schedule");
                    const data: Event[] = await res.json();
                    const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    set({ events: sorted });
                } catch (err) {
                    console.error("Error fetching events:", err);
                } finally {
                    set({ loading: false });
                }
            },
        }),
        { name: "befa_training_events" } // localStorage key
    )
);

// ===== Countdown Hook =====
export const useNextEventCountdown = (events: Event[]) => {
    const [countdown, setCountdown] = useState<string>("");
    const [nextEvent, setNextEvent] = useState<Event | null>(null);

    useEffect(() => {
        const now = new Date();
        const upcoming = events
            .map((e) => ({
                ...e,
                datetime: new Date(`${e.date}T${e.time}`),
            }))
            .filter((e) => e.datetime > now)
            .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())[0];

        setNextEvent(upcoming || null);

        if (!upcoming) {
            setCountdown("");
            return;
        }

        const interval = setInterval(() => {
            const diff = upcoming.datetime.getTime() - new Date().getTime();
            if (diff <= 0) {
                setCountdown("Now");
                clearInterval(interval);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setCountdown(days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${mins}m` : `${mins}m`);
        }, 1000);

        return () => clearInterval(interval);
    }, [events]);

    return { countdown, nextEvent };
};

// ===== Auto-Refresh Hook =====
export const useBackgroundRefresh = (intervalMs: number = 300000) => {
    const fetchEvents = useEventStore((state) => state.fetchEvents);

    useEffect(() => {
        fetchEvents(); // fetch on mount
        const interval = setInterval(fetchEvents, intervalMs);
        return () => clearInterval(interval);
    }, [fetchEvents, intervalMs]);
};
