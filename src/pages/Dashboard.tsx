import type React from "react";
import { useState } from "react";
// import { useEcommerceStore } from "../store";
import DashboardHeader from "../components/layout/DashboardHeader";
import PlayerSpotlight from "./PlayerSpotlight";
import ComingSoon from "./ComingSoon";
import LandingPage from "./LandingPage.tsx";
import BefaNews from "./BefaNews.tsx";

const Dashboard: React.FC = () => {
    // const { fetchCart } = useEcommerceStore();
    const [currentPage, setCurrentPage] = useState("/dashboard");

    // useEffect(() => {
    //     fetchCart();
    // }, [fetchCart]);

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage) {
            case "/befa-news":
                return (
                    <div className="min-h-screen bg-black text-white pt-20">
                        <BefaNews onNavigate={handleNavigate} />
                    </div>
                );
            case "/player-spotlight":
                return (
                    <div className="min-h-screen bg-black text-white pt-20">
                        <PlayerSpotlight onNavigate={handleNavigate} />
                    </div>
                );
            case "/live-stream":
                return (
                    <div className="min-h-screen bg-black text-white pt-20">
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
                    </div>
                );
            case "/top5-leagues":
                return (
                    <div className="min-h-screen bg-black text-white pt-20">
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
                    </div>
                );
            default:
                return (
                    <div className="min-h-screen bg-black text-white pt-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <LandingPage />
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
