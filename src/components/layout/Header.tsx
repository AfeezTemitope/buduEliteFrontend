import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, Video, Tv, Menu, X, Newspaper } from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  comingSoon?: boolean;
}

const navigation: NavItem[] = [
  { name: "Home", path: "/", icon: Home },
  { name: "News", path: "/news", icon: Newspaper },
  { name: "Player Spotlight", path: "/players", icon: Trophy },
  { name: "(BEFA Match)", path: "/live", icon: Video, comingSoon: true },
  { name: "League Games", path: "/leagues", icon: Tv, comingSoon: true },
];

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/90 border-b border-lime-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-8 flex items-center justify-center">
              <img 
                src="/drilldown.png" 
                alt="BEFA Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-white text-xs">Welcome to BEFA</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-lime-400 text-black"
                      : "text-gray-300 hover:text-lime-400 hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.comingSoon && (
                    <span className="bg-lime-400/20 text-lime-400 text-xs px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-lime-400 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-700">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-lime-400 text-black"
                        : "text-gray-300 hover:text-lime-400 hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.comingSoon && (
                      <span className="bg-lime-400/20 text-lime-400 text-xs px-2 py-1 rounded-full">
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;