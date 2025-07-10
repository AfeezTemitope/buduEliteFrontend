import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';

interface Event {
  id: number;
  date: string;
  time: string;
  venue: string;
  jersey_color: string;
  image_url?: string;
  created_at: string;
}

const TrainingSchedule: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/schedule/events/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch training schedule');
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load training schedule');
      toast.error('Failed to load training schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      dayMonth: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  if (loading) {
    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Calendar className="w-5 h-5 text-lime-400 mr-2" />
              Training Schedule
            </h2>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="w-5 h-5 text-lime-400" />
            </motion.div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-black/30 border border-gray-700 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
            ))}
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Calendar className="w-5 h-5 text-lime-400 mr-2" />
              Training Schedule
            </h2>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchEvents}
                className="px-3 py-1 bg-lime-400 hover:bg-lime-500 text-black text-sm rounded-md transition-colors"
            >
              Retry
            </motion.button>
          </div>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">{error}</p>
            <button
                onClick={fetchEvents}
                className="text-lime-400 hover:text-lime-300 text-sm"
            >
              Try again
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between mb-6"
        >
          <h2 className="text-xl font-bold text-white flex items-center">
            <Calendar className="w-5 h-5 text-lime-400 mr-2" />
            Training Schedule
          </h2>
          <div className="flex items-center space-x-2">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchEvents}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
            <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-2xl"
            >
              ⚽
            </motion.div>
          </div>
        </motion.div>

        {events.length === 0 ? (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
            >
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No training sessions scheduled</p>
              <p className="text-gray-500 text-sm">Check back later for updates</p>
            </motion.div>
        ) : (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {events.map((event, index) => {
                const dateInfo = formatDate(event.date);
                const formattedTime = formatTime(event.time);

                return (
                    <motion.div
                        key={event.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="relative p-4 rounded-lg border bg-black/30 border-gray-700 hover:border-lime-400/30 transition-all duration-300"
                    >
                      <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                          style={{ backgroundColor: event.jersey_color }}
                          animate={{
                            boxShadow: [
                              `0 0 5px ${event.jersey_color}40`,
                              `0 0 15px ${event.jersey_color}60`,
                              `0 0 5px ${event.jersey_color}40`,
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                      />

                      <div className="ml-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-white">{dateInfo.dayName}</h3>
                            <span className="text-sm text-gray-400">{dateInfo.dayMonth}</span>
                          </div>
                          <div
                              className="w-4 h-4 rounded-full border-2 border-white/20"
                              style={{ backgroundColor: event.jersey_color }}
                              title={`Jersey Color: ${event.jersey_color}`}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center text-gray-300">
                            <Clock className="w-4 h-4 text-lime-400 mr-2" />
                            {formattedTime}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <MapPin className="w-4 h-4 text-lime-400 mr-2" />
                            {event.venue}
                          </div>
                        </div>

                        {event.image_url && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-3 rounded-lg overflow-hidden"
                            >
                              <img
                                  src={event.image_url}
                                  alt="Training session"
                                  className="w-full h-32 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                              />
                            </motion.div>
                        )}

                        <motion.div
                            className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <motion.div
                              className="h-full bg-gradient-to-r from-lime-400 to-lime-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.random() * 100}%` }}
                              transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                );
              })}
            </motion.div>
        )}
      </div>
  );
};

export default TrainingSchedule;
