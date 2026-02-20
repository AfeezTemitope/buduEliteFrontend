import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import TournamentBanner from './components/TournamentBanner';
import SEOHelmet from './components/SEOHelmet';
import LoadingSpinner from './components/common/LoadingSpinner';
import { routes } from './routes';

// SEO wrapper component
const PageWrapper = ({ children, title, description }: any) => {
    return (
        <>
            <SEOHelmet title={title} description={description} />
            {children}
        </>
    );
};

function AppContent() {
    const location = useLocation();

    // Find current route for SEO
    const currentRoute = routes.find(route => route.path === location.pathname);

    return (
        <div className="App min-h-screen bg-black">
            {/* Tournament Banner - Set enabled={false} to disable */}
            <TournamentBanner
                enabled={false}  // Change too false to hide banner
                showOnce={true}
            />

            <Header />

            <Suspense
                fallback={
                    <div className="min-h-screen pt-20 flex items-center justify-center">
                        <LoadingSpinner size="lg" />
                    </div>
                }
            >
                <Routes>
                    {routes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <PageWrapper
                                    title={route.title}
                                    description={route.description}
                                >
                                    {route.element}
                                </PageWrapper>
                            }
                        />
                    ))}
                </Routes>
            </Suspense>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1f2939',
                        color: '#ffffff',
                        border: '1px solid #374151',
                    },
                    success: {
                        iconTheme: {
                            primary: '#32cd32',
                            secondary: '#000000',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;