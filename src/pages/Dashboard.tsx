import type React from "react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store";
import { useEcommerceStore } from "../store";
import DashboardHeader from "../components/layout/DashboardHeader";
import TrainingSchedule from "../components/dashboard/TrainingSchedule";
import BefaNews from "./BefaNews";
import BefaStore from "./BefaStore";
import PlayerSpotlight from "./PlayerSpotlight";
import ComingSoon from "./ComingSoon";

const Dashboard: React.FC = () => {
    useAuthStore();
    const { fetchCart } = useEcommerceStore();
    const [currentPage, setCurrentPage] = useState("/dashboard");

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage) {
            case "/befa-store":
                return <BefaStore onNavigate={handleNavigate} />;
            case "/player-spotlight":
                return <PlayerSpotlight onNavigate={handleNavigate} />;
            case "/live-stream":
                return (
                    <ComingSoon
                        onNavigate={handleNavigate}
                        title="BEFA Match Live Stream"
                        description="Watch live matches and tournaments from the BEFA league"
                        features={[
                            "Live HD streaming of all BEFA matches",
                            "Multiple camera angles and replays",
                            "Real-time match statistics and analytics",
                            "Interactive live chat with other fans",
                            "Match highlights and post-game analysis",
                            "Mobile-optimized viewing experience",
                        ]}
                    />
                );
            case "/top5-leagues":
                return (
                    <ComingSoon
                        onNavigate={handleNavigate}
                        title="Top 5 Leagues Live Stream"
                        description="Stream matches from the world's top football leagues"
                        features={[
                            "Premier League live matches",
                            "La Liga and Serie A coverage",
                            "Bundesliga and Ligue 1 streams",
                            "Champions League and Europa League",
                            "Match predictions and analysis",
                            "Player performance tracking",
                        ]}
                    />
                );
            default:
                return (
                    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            {/* Stacked Layout: Training Schedule + Football News */}
                            <div className="flex flex-col space-y-8">
                                <TrainingSchedule />
                                <BefaNews />
                            </div>

                            {/* Coming Soon Section */}
                            <div className="mt-10 bg-gradient-to-r from-lime-400/10 to-lime-500/10 border border-lime-400/20 rounded-xl p-8 text-center">
                                <div className="text-4xl mb-4">🚀</div>
                                <h3 className="text-2xl font-bold text-white mb-2">More Features Coming Soon!</h3>
                                <p className="text-gray-400">
                                    We're working on exciting new features including live streaming, advanced analytics, video reviews,
                                    and much more!
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <DashboardHeader currentPage={currentPage} onNavigate={handleNavigate} />
            {renderPage()}
        </>
    );
};

export default Dashboard;