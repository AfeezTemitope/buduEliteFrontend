import React from "react";
import { Home, Trophy, Video, Tv, Menu, X, Newspaper } from "lucide-react";
// import { useEcommerceStore } from "../../store";

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    comingSoon?: boolean;
}

const navigation: NavigationItem[] = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "News", href: "/befa-news", icon: Newspaper },
    { name: "Player Spotlight", href: "/player-spotlight", icon: Trophy },
    { name: "(BEFA Match)", href: "/live-stream", icon: Video, comingSoon: true },
    { name: "League Games", href: "/top5-leagues", icon: Tv, comingSoon: true },
];

interface DashboardHeaderProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentPage, onNavigate }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    // const { cartItems } = useEcommerceStore();

    // const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/90 border-b border-lime-400/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-8 flex items-center justify-center">
                            <img src="/drilldown.png" alt="BEFA Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-white text-xs">Welcome to BEFA</p>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center space-x-1">
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => onNavigate(item.href)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === item.href
                                        ? "bg-lime-400 text-black"
                                        : "text-gray-300 hover:text-lime-400 hover:bg-gray-800/50"
                                }`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.name}</span>
                                {item.comingSoon && (
                                    <span className="bg-lime-400/20 text-lime-400 text-xs px-2 py-0.5 rounded-full">
                                        Soon
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => onNavigate("/befa-store")}
                            className="relative p-2 text-gray-300 hover:text-lime-400 transition-colors"
                        >
                            {/*<ShoppingCart className="w-5 h-5" />*/}
                            {/*{cartItemsCount > 0 && (*/}
                            {/*    <span className="absolute -top-1 -right-1 bg-lime-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">*/}
                            {/*        {cartItemsCount}*/}
                            {/*    </span>*/}
                            {/*)}*/}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-300 hover:text-lime-400 transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <nav className="lg:hidden py-4 border-t border-gray-700">
                        <div className="space-y-2">
                            {navigation.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        onNavigate(item.href);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === item.href
                                            ? "bg-lime-400 text-black"
                                            : "text-gray-300 hover:text-lime-400 hover:bg-gray-800/50"
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.comingSoon && (
                                        <span className="bg-lime-400/20 text-lime-400 text-xs px-2 py-1 rounded-full">
                                            Soon
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default DashboardHeader;
