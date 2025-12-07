import { useState, useEffect } from 'react';
import { X, Trophy, Calendar, MapPin } from 'lucide-react';

interface TournamentBannerProps {
    enabled?: boolean;
    showOnce?: boolean;
}

const TournamentBanner = ({ enabled = true, showOnce = true }: TournamentBannerProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        if (showOnce) {
            const wasDismissed = localStorage.getItem('tournament_banner_dismissed');
            if (wasDismissed === 'true') {
                setDismissed(true);
                return;
            }
        }

        setIsVisible(true);
    }, [enabled, showOnce]);

    const handleDismiss = () => {
        setIsVisible(false);
        setDismissed(true);
        if (showOnce) {
            localStorage.setItem('tournament_banner_dismissed', 'true');
        }
    };

    if (!isVisible || !enabled || dismissed) return null;

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
                onClick={handleDismiss}
            />

            {/* Modal Card */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[55vw] max-w-sm pointer-events-auto">
                <div className="bg-gradient-to-br from-lime-400 via-green-500 to-lime-400 rounded-xl shadow-2xl overflow-hidden animate-scale-in">
                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-2 right-2 z-10 p-1 bg-black/30 hover:bg-black/50 rounded-full transition-all"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4 text-white" />
                    </button>

                    {/* Card Content */}
                    <div className="p-4 flex flex-col items-center text-center space-y-3">
                        {/* Trophy Icon */}
                        <div className="bg-black/10 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-black" />
                        </div>

                        {/* Main Title */}
                        <div className="space-y-0.5">
                            <h1 className="text-base sm:text-lg font-black text-black leading-tight">
                                🎉 We're Participating!
                            </h1>
                            <p className="text-xs sm:text-sm font-bold text-black/90">
                                Twitter Football Tournament
                            </p>
                        </div>

                        {/* Tournament Poster Image */}
                        <div className="w-full">
                            <img
                                src="/tournament-poster.jpg"
                                alt="Twitter Football Tournament"
                                className="w-full h-auto rounded-lg border-2 border-black/20 shadow-lg"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/drilldown.png';
                                }}
                            />
                        </div>

                        {/* Event Details */}
                        <div className="w-full bg-black/10 backdrop-blur-sm rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-center">
                                <div className="bg-black text-lime-400 px-2 py-1 rounded-md font-bold text-xs">
                                    Meet Our Squad
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-1 text-black font-semibold text-[10px] sm:text-xs">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>Campos Mini Stadium</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Dec 6, 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </>
    );
};

export default TournamentBanner;