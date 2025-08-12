import { useEffect, useState } from "react";
import { ArrowLeft, Trophy, Star, Award, Target } from 'lucide-react';
import { usePlayerStore } from "../store/playerStore";

const PlayerSpotlight = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
    const {
        playerOfTheMonth,
        featuredPlayers,
        loading,
        error,
        fetchPlayerOfTheMonth,
        fetchFeaturedPlayers,
    } = usePlayerStore();

    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (retryCount <= 3) {
            fetchPlayerOfTheMonth();
            fetchFeaturedPlayers();
        }
    }, [fetchPlayerOfTheMonth, fetchFeaturedPlayers, retryCount]);

    const handleRefresh = () => {
        setRetryCount((prev) => prev + 1);
        fetchPlayerOfTheMonth();
        fetchFeaturedPlayers();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-16 sm:pt-20 flex items-center justify-center px-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-16 sm:pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <button
                                onClick={() => onNavigate && onNavigate("/dashboard")}
                                className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Player Spotlight</h1>
                                <p className="text-gray-400 text-xs sm:text-sm">Celebrating outstanding talent in the BEFA community</p>
                            </div>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="px-3 py-2 sm:px-4 bg-lime-400 text-black rounded-lg hover:bg-lime-300 transition-colors text-xs sm:text-sm"
                        >
                            Refresh
                        </button>
                    </div>

                    {error && retryCount >= 3 && (
                        <div className="text-center py-4">
                            <p className="text-gray-500 text-xs sm:text-sm mb-2">We're having trouble loading player data.</p>
                            <button
                                onClick={handleRefresh}
                                className="px-4 py-2 bg-lime-400 text-black rounded-lg text-sm hover:bg-lime-300"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Player of the Month */}
                {playerOfTheMonth ? (
                    <div className="bg-gradient-to-r from-lime-400/10 to-lime-500/10 border border-lime-400/20 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-lime-400" />
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Player of the Month</h2>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            {/* Image & Info */}
                            <div className="text-center lg:text-left">
                                <div className="mx-auto lg:mx-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-xl overflow-hidden border-4 border-lime-400/30 mb-4">
                                    <img
                                        src={playerOfTheMonth.image || "/placeholder.svg"}
                                        alt={playerOfTheMonth.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/drilldown.png";
                                        }}
                                    />
                                </div>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">{playerOfTheMonth.name}</h3>
                                <p className="text-lime-400 font-semibold mb-1 text-sm sm:text-base">{playerOfTheMonth.position}</p>
                                <p className="text-gray-400 text-xs sm:text-sm">{playerOfTheMonth.team}</p>
                            </div>

                            {/* Stats */}
                            <div>
                                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400 mr-2" />
                                    Season Statistics
                                </h4>
                                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                    {Object.entries({
                                        goals: playerOfTheMonth.goals,
                                        assists: playerOfTheMonth.assists,
                                        matches: playerOfTheMonth.matches,
                                        rating: playerOfTheMonth.rating,
                                        saves: playerOfTheMonth.saves,
                                        cleanSheets: playerOfTheMonth.cleanSheets,
                                    })
                                        .filter(([, value]) => value !== undefined && value !== null)
                                        .map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="bg-black/30 border border-gray-700 rounded-lg p-2 sm:p-4 text-center"
                                            >
                                                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-lime-400 mb-1">{value}</div>
                                                <div className="text-gray-400 text-xs sm:text-sm capitalize">{key}</div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Achievements & Bio */}
                            <div>
                                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400 mr-2" />
                                    Achievements
                                </h4>
                                <div className="space-y-2 mb-4 sm:mb-6">
                                    {playerOfTheMonth.achievements?.map((achievement, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-lime-400" />
                                            <span className="text-gray-300 text-xs sm:text-sm">{achievement}</span>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h5 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2">About</h5>
                                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{playerOfTheMonth.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 sm:py-8 mb-6 sm:mb-8">
                        <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-500 text-sm sm:text-base">Player of the month not available yet.</p>
                    </div>
                )}

                {/* Featured Players */}
                <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                        <Star className="w-5 h-5 sm:w-6 sm:h-6 text-lime-400 mr-2" />
                        Featured Players
                    </h2>

                    {featuredPlayers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {featuredPlayers.map((player) => (
                                <div
                                    key={player.id}
                                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 hover:border-lime-400/30 transition-colors"
                                >
                                    <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-lime-400/30">
                                            <img
                                                src={player.image || "/placeholder.svg"}
                                                alt={player.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/drilldown.png";
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">{player.name}</h3>
                                            <p className="text-lime-400 text-xs sm:text-sm">{player.position}</p>
                                            <p className="text-gray-400 text-xs">{player.team}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
                                        {Object.entries({
                                            goals: player.goals,
                                            assists: player.assists,
                                            matches: player.matches,
                                            saves: player.saves,
                                            cleanSheets: player.cleanSheets,
                                        })
                                            .filter(([, value]) => value !== undefined && value !== null)
                                            .slice(0, 3)
                                            .map(([key, value]) => (
                                                <div key={key} className="bg-black/30 rounded-lg p-1 sm:p-2">
                                                    <div className="text-sm sm:text-base lg:text-lg font-bold text-lime-400">{value}</div>
                                                    <div className="text-gray-400 text-xs capitalize">{key}</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Star className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600 mx-auto mb-3 opacity-50" />
                            <p className="text-gray-500 text-xs sm:text-sm">No featured players to display.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerSpotlight;
