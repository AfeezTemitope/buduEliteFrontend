import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Award, Target } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';

interface PlayerSpotlightProps {
    onNavigate: (page: string) => void;
}

const PlayerSpotlight: React.FC<PlayerSpotlightProps> = ({ onNavigate }) => {
    const {
        playerOfTheMonth,
        featuredPlayers,
        loading,
        error,
        fetchPlayerOfTheMonth,
        fetchFeaturedPlayers,
    } = usePlayerStore();
    const { isAuthenticated, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/login');
            return;
        }
        if (isAuthenticated) {
            fetchPlayerOfTheMonth();
            fetchFeaturedPlayers();
        }
    }, [isAuthenticated, authLoading, fetchPlayerOfTheMonth, fetchFeaturedPlayers, navigate]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <motion.button
                            whileHover={{ scale: 1.1, x: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onNavigate('/dashboard')}
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </motion.button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Player Spotlight</h1>
                            <p className="text-gray-400">Celebrating outstanding talent in the BEFA community</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                fetchPlayerOfTheMonth();
                                fetchFeaturedPlayers();
                            }}
                            className="px-4 py-2 bg-lime-400 text-black rounded-lg hover:bg-lime-300 transition-colors"
                        >
                            Refresh Players
                        </button>
                    </div>
                </motion.div>

                {error && (
                    <div className="text-red-500 text-center mb-6">
                        {error}
                        {error.includes('Please log in') && (
                            <button
                                onClick={() => navigate('/')}
                                className="ml-4 px-4 py-2 bg-lime-400 text-black rounded-lg hover:bg-lime-300"
                            >
                                Log In
                            </button>
                        )}
                    </div>
                )}

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                    {/* Player of the Month */}
                    {playerOfTheMonth ? (
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-r from-lime-400/10 to-lime-500/10 border border-lime-400/20 rounded-2xl p-8"
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <Trophy className="w-8 h-8 text-lime-400" />
                                <h2 className="text-2xl font-bold text-white">Player of the Month</h2>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Player Image and Basic Info */}
                                <div className="text-center lg:text-left">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="mx-auto lg:mx-0 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-xl overflow-hidden border-4 border-lime-400/30 mb-4"
                                    >
                                        <img
                                            src={playerOfTheMonth.image}
                                            alt={playerOfTheMonth.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{playerOfTheMonth.name}</h3>
                                    <p className="text-lime-400 font-semibold mb-1">{playerOfTheMonth.position}</p>
                                    <p className="text-gray-400 text-sm">{playerOfTheMonth.team}</p>
                                </div>

                                {/* Stats */}
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                                        <Target className="w-5 h-5 text-lime-400 mr-2" />
                                        Season Statistics
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries({
                                            goals: playerOfTheMonth.goals,
                                            assists: playerOfTheMonth.assists,
                                            matches: playerOfTheMonth.matches,
                                            rating: playerOfTheMonth.rating,
                                            saves: playerOfTheMonth.saves,
                                            cleanSheets: playerOfTheMonth.cleanSheets,
                                        })
                                            .filter(([_, value]) => value !== undefined && value !== null)
                                            .map(([key, value]) => (
                                                <motion.div
                                                    key={key}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="bg-black/30 border border-gray-700 rounded-lg p-4 text-center"
                                                >
                                                    <div className="text-2xl font-bold text-lime-400 mb-1">{value}</div>
                                                    <div className="text-gray-400 text-sm capitalize">{key}</div>
                                                </motion.div>
                                            ))}
                                    </div>
                                </div>

                                {/* Achievements and Bio */}
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                                        <Award className="w-5 h-5 text-lime-400 mr-2" />
                                        Achievements
                                    </h4>
                                    <div className="space-y-2 mb-6">
                                        {playerOfTheMonth.achievements?.map((achievement, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                className="flex items-center space-x-2"
                                            >
                                                <Star className="w-4 h-4 text-lime-400" />
                                                <span className="text-gray-300 text-sm">{achievement}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-semibold text-white mb-2">About</h5>
                                        <p className="text-gray-400 text-sm leading-relaxed">{playerOfTheMonth.bio}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            No Player of the Month available
                        </div>
                    )}

                    {/* Featured Players */}
                    <motion.div variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <Star className="w-6 h-6 text-lime-400 mr-2" />
                            Featured Players
                        </h2>
                        {featuredPlayers.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredPlayers.map((player) => (
                                    <motion.div
                                        key={player.id}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-lime-400/30 transition-all"
                                    >
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-lime-400/30">
                                                <img
                                                    src={player.image}
                                                    alt={player.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{player.name}</h3>
                                                <p className="text-lime-400 text-sm">{player.position}</p>
                                                <p className="text-gray-400 text-xs">{player.team}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            {Object.entries({
                                                goals: player.goals,
                                                assists: player.assists,
                                                matches: player.matches,
                                                saves: player.saves,
                                                cleanSheets: player.cleanSheets,
                                            })
                                                .filter(([_, value]) => value !== undefined && value !== null)
                                                .map(([key, value]) => (
                                                    <div key={key} className="bg-black/30 rounded-lg p-2">
                                                        <div className="text-lg font-bold text-lime-400">{value}</div>
                                                        <div className="text-gray-400 text-xs capitalize">{key}</div>
                                                    </div>
                                                ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-4">
                                No featured players available
                            </div>
                        )}
                    </motion.div>

                    {/* Coming Soon Section */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-r from-purple-400/10 to-purple-500/10 border border-purple-400/20 rounded-xl p-8 text-center"
                    >
                        <h3 className="text-2xl font-bold text-white mb-2">More Features Coming Soon!</h3>
                        <p className="text-gray-400">
                            Player comparison tools, detailed performance analytics, video highlights, and much more!
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default PlayerSpotlight;