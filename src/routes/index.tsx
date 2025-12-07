import Home from '../pages/Home';
import News from '../pages/News';
import PlayerSpotlight from '../pages/PlayerSpotlight';
import Store from '../pages/Store';
import ComingSoon from '../pages/ComingSoon';
export interface RouteConfig {
    path: string;
    element: React.ReactNode;
    title: string;
    description: string;
}

export const routes: RouteConfig[] = [
    {
        path: '/',
        element: <Home />,
        title: 'Budu Elite Football Academy - Home',
        description: 'Nurturing world-class football talent through elite training, mentorship, and cutting-edge technology.',
    },
    {
        path: '/news',
        element: <News />,
        title: 'BEFA News - Latest Updates',
        description: 'Stay updated with the latest news, announcements, and highlights from Budu Elite Football Academy.',
    },
    {
        path: '/players',
        element: <PlayerSpotlight />,
        title: 'Player Spotlight - Featured Athletes',
        description: 'Celebrating outstanding talent in the BEFA community. Meet our players of the month and featured athletes.',
    },
    {
        path: '/store',
        element: <Store />,
        title: 'BEFA Store - Official Merchandise',
        description: 'Shop official Budu Elite Football Academy merchandise, equipment, and apparel.',
    },
    {
        path: '/live',
        element: (
            <ComingSoon
                title="BEFA Match Live Stream"
                description="Watch live matches and tournaments from the BEFA league"
                features={[
                    'Live HD streaming of all BEFA matches',
                    'Multiple camera angles and replays',
                    'Real-time match statistics and analytics',
                    'Interactive live chat with other fans',
                    'Match highlights and post-game analysis',
                    'Mobile-optimized viewing experience',
                ]}
            />
        ),
        title: 'Live Streaming - BEFA Matches',
        description: 'Watch BEFA matches live with HD streaming, real-time statistics, and interactive features.',
    },
    {
        path: '/leagues',
        element: (
            <ComingSoon
                title="Top 5 Leagues Live Stream"
                description="Stream matches from the world's top football leagues"
                features={[
                    'Premier League live matches',
                    'La Liga and Serie A coverage',
                    'Bundesliga and Ligue 1 streams',
                    'Champions League and Europa League',
                    'Match predictions and analysis',
                    'Player performance tracking',
                ]}
            />
        ),
        title: 'Top Leagues Streaming - Premier League, La Liga & More',
        description: 'Stream live matches from Premier League, La Liga, Serie A, Bundesliga, and Champions League.',
    },
];