import React, { useEffect } from "react";
import { Star, Trophy, Users, Calendar, Clock, MapPin, RefreshCw } from "lucide-react";
import { useScheduleStore } from "../store/scheduleStore";
import { formatDate, formatTime, getJerseyColor } from "../utils/formatters";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Home: React.FC = () => {
  const { events, loading, fetchEvents } = useScheduleStore();

  useEffect(() => {
    fetchEvents();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchEvents, 300000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const stats = [
    { icon: Trophy, label: "Champions Trained", value: "50+" },
    { icon: Star, label: "Elite Coaches", value: "3" },
    { icon: Users, label: "Active Players", value: "100+" },
    { icon: Trophy, label: "Year of Excellence", value: "First" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #32cd32 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Budu Elite
            <span className="block text-lime-400">Football Academy</span>
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            This is an academy dedicated to{" "}
            <span className="text-lime-400 font-semibold">nurturing world-class football talent</span>{" "}
            and developing champions both on and off the field through elite training, mentorship, and
            cutting-edge technology.
          </p>
        </div>

        {/* Training Schedule */}
        <div className="mb-16">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400" />
                <span className="truncate">Training Schedule</span>
              </h2>
              <button
                onClick={fetchEvents}
                className="p-1.5 sm:p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors flex-shrink-0"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            {loading && events.length === 0 ? (
              <LoadingSpinner />
            ) : events.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-2 opacity-50" />
                <p className="text-gray-400 text-sm">No upcoming training sessions</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {events.map((event) => {
                  const { dayName, dayMonth } = formatDate(event.date);
                  const jerseyColor = getJerseyColor(event.jersey_color);
                  return (
                    <div
                      key={event.id}
                      className="p-4 border border-gray-700 rounded-lg bg-black/20 hover:border-lime-400/40 transition-colors"
                    >
                      <div className="text-center mb-3">
                        <div className="text-lime-400 font-bold text-sm">{dayName}</div>
                        <div className="text-white font-medium text-lg">{dayMonth}</div>
                      </div>
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
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="w-4 h-4 rounded border border-gray-500"
                          style={{ backgroundColor: jerseyColor }}
                        />
                        <span className="text-xs px-2 py-1 bg-lime-400/20 text-lime-400 rounded">
                          {event.jersey_color}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-lime-400/30 transition-colors shadow-lg"
              >
                <Icon className="w-10 h-10 text-lime-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* WhatsApp Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://whatsapp.com/channel/0029Vb6p1cw17EmxfuyKfQ1y"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 min-w-[200px] justify-center"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            WhatsApp Channel
          </a>
          <a
            href="https://chat.whatsapp.com/your-fan-group-link"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 min-w-[200px] justify-center"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            WhatsApp Fan Group
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;