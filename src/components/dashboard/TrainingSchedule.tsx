import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, RefreshCw } from 'lucide-react';
import { useAuthStore } from "../../store";

interface Event {
    id: number;
    date: string;
    time: string;
    venue: string;
    jersey_color: string;
    image_url?: string;
    created_at: string;
}

const BEFA = import.meta.env.VITE_BASE_URL;

// Map jersey labels to colors
const jerseyColorMap: Record<string, string> = {
    BLACK: "#000000",
    BLUE: "#0000FF",
    "BLACK JERSEY": "#000000",
    "BLUE JERSEY": "#0000FF",
};

// Format date
const formatDate = (dateString: string) => {
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

// Format time
const formatTime = (timeString: string) => {
    const [h, m] = timeString.split(":");
    const d = new Date();
    d.setHours(parseInt(h, 10), parseInt(m, 10));
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

// Get jersey color
const getJerseyColor = (label: string): string => {
    return jerseyColorMap[label.toUpperCase().trim()] || "#9ca3af";
};

// Custom Hook: Safely get next event and countdown (avoids conditional hook calls)
const useNextEventCountdown = (events: Event[]) => {
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

const TrainingSchedule: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuthStore();

    const fetchEvents = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${BEFA}/schedule/events/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch training schedule");

            const data: Event[] = await response.json();
            // Sort by date (oldest first)
            const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setEvents(sorted);
        } catch (err) {
            console.error("Error fetching events:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchEvents();
        } else {
            setLoading(false);
        }
    }, [token]);

    // ✅ Hook called unconditionally — ESLint safe
    const { countdown, nextEvent } = useNextEventCountdown(events);

    if (loading) {
        return (
            <div className="w-full max-w-6xl mx-auto">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400" />
                            Training Schedule
                        </h2>
                        <RefreshCw className="w-4 h-4 text-lime-400 animate-spin" />
                    </div>
                    <div className="h-16 sm:h-20 bg-black/20 rounded-lg animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 text-center">
                    <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500 mx-auto mb-2 opacity-70" />
                    <p className="text-white text-sm sm:text-base">We re on holiday!!!.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400" />
                        <span className="truncate">Training Schedule</span>
                    </h2>
                    <button
                        onClick={fetchEvents}
                        className="p-1.5 sm:p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors flex-shrink-0"
                        aria-label="Refresh schedule"
                    >
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                </div>

                {/* Countdown to Next Session */}
                {nextEvent && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-lime-400/10 to-transparent border border-lime-400/20 rounded-lg">
                        <p className="text-gray-300 text-xs sm:text-sm leading-tight">
                            Next Session:{" "}
                            <strong className="text-white">{formatDate(nextEvent.date).full}</strong> at{" "}
                            <strong className="text-white">{formatTime(nextEvent.time)}</strong>
                        </p>
                        <p className="text-lime-400 font-bold mt-1 text-xs sm:text-base">⏳ {countdown} remaining</p>
                    </div>
                )}

                {/* Mobile: Properly Constrained Scrollable Cards */}
                <div className="block sm:hidden">
                    <div className="w-full overflow-x-auto">
                        <div className="flex space-x-4 pb-3" style={{ width: 'max-content' }}>
                            {events.map((event) => {
                                const { dayName, dayMonth } = formatDate(event.date);
                                const jerseyColor = getJerseyColor(event.jersey_color);

                                return (
                                    <div
                                        key={event.id}
                                        className="flex-shrink-0 w-40 p-3 border border-gray-700 rounded-lg bg-black/20 hover:border-lime-400/40 transition-colors"
                                    >
                                        {/* Day & Date */}
                                        <div className="text-center mb-3">
                                            <div className="text-lime-400 font-bold text-xs">{dayName}</div>
                                            <div className="text-white font-medium text-base">{dayMonth}</div>
                                        </div>

                                        {/* Time & Venue */}
                                        <div className="space-y-2 mb-3 text-xs text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{formatTime(event.time)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate" title={event.venue}>
                              {event.venue}
                            </span>
                                            </div>
                                        </div>

                                        {/* Jersey Indicator */}
                                        <div className="flex items-center justify-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded border border-gray-500"
                                                style={{ backgroundColor: jerseyColor }}
                                                title={event.jersey_color}
                                            ></div>
                                            <span className="text-xs px-2 py-1 bg-lime-400/20 text-lime-400 rounded text-center">
                            {event.jersey_color.length > 8 ? event.jersey_color.substring(0, 8) + '...' : event.jersey_color}
                          </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Desktop: Grid Layout */}
                <div className="hidden sm:block">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                        {events.map((event) => {
                            const { dayName, dayMonth } = formatDate(event.date);
                            const jerseyColor = getJerseyColor(event.jersey_color);

                            return (
                                <div
                                    key={event.id}
                                    className="p-4 border border-gray-700 rounded-lg bg-black/20 hover:border-lime-400/40 transition-colors"
                                >
                                    {/* Day & Date */}
                                    <div className="text-center mb-3">
                                        <div className="text-lime-400 font-bold text-sm">{dayName}</div>
                                        <div className="text-white font-medium text-lg">{dayMonth}</div>
                                    </div>

                                    {/* Time & Venue */}
                                    <div className="space-y-2 mb-3 text-sm text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            {formatTime(event.time)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="truncate">{event.venue}</span>
                                        </div>
                                    </div>

                                    {/* Jersey Indicator */}
                                    <div className="flex items-center justify-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded border border-gray-500"
                                            style={{ backgroundColor: jerseyColor }}
                                            title={event.jersey_color}
                                        ></div>
                                        <span className="text-xs px-2 py-1 bg-lime-400/20 text-lime-400 rounded">
                          {event.jersey_color}
                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingSchedule;
