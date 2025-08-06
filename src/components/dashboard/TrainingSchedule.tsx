import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, RefreshCw } from "lucide-react";
import { useAuthStore } from "../../store";
import toast from "react-hot-toast";

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
      toast.error("Could not load schedule");
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
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-lime-400" />
              Training Schedule
            </h2>
            <RefreshCw className="w-4 h-4 text-lime-400 animate-spin" />
          </div>
          <div className="h-20 bg-black/20 rounded-lg animate-pulse"></div>
        </div>
    );
  }

  if (events.length === 0) {
    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 max-w-4xl mx-auto text-center">
          <Calendar className="w-10 h-10 text-gray-500 mx-auto mb-2 opacity-70" />
          <p className="text-white">No training sessions scheduled.</p>
        </div>
    );
  }

  return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-lime-400" />
            Training Schedule
          </h2>
          <button
              onClick={fetchEvents}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
              aria-label="Refresh schedule"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Countdown to Next Session */}
        {nextEvent && (
            <div className="mb-6 p-4 bg-gradient-to-r from-lime-400/10 to-transparent border border-lime-400/20 rounded-lg">
              <p className="text-gray-300 text-sm">
                Next Session:{" "}
                <strong className="text-white">{formatDate(nextEvent.date).full}</strong> at{" "}
                <strong className="text-white">{formatTime(nextEvent.time)}</strong>
              </p>
              <p className="text-lime-400 font-bold mt-1">⏳ {countdown} remaining</p>
            </div>
        )}

        {/* Scrollable Cards – Only for Fetched Days */}
        <div className="flex overflow-x-auto pb-3 space-x-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
          {events.map((event) => {
            const { dayName, dayMonth } = formatDate(event.date);
            const jerseyColor = getJerseyColor(event.jersey_color);

            return (
                <div
                    key={event.id}
                    className="flex-shrink-0 w-48 p-4 border border-gray-700 rounded-lg bg-black/20 hover:border-lime-400/40 transition-colors"
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
                      {event.venue}
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
  );
};

export default TrainingSchedule;