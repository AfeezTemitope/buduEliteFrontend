import type React from "react";
import { useState } from "react";
import { Star, Trophy, Users, ArrowRight } from "lucide-react";
import AuthModal from "../components/auth/AuthModal";

const LandingPage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
      <div className="w-full bg-black text-white">
        {/* Header */}
        <header className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-12 flex items-center justify-center">
                <img src="/drilldown.png" alt="BEFA Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-lime-600 text-sm">Budu Elite Football Academy</p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-16 py-12">
          <div className="max-w-6xl mx-auto text-center">
            {/* Title */}
            <div className="mb-8">
              <h1
                  className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 leading-tight"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #32cd32 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
              >
                Budu Elite
                <span className="block text-lime-400">Football Academy</span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="mb-12">
              <p className="text-base sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                This is an academy dedicated to{" "}
                <span className="text-lime-400 font-semibold">nurturing world-class football talent</span> and
                developing champions both on and off the field through elite training, mentorship, and cutting-edge
                technology.
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-16">
              <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-lime-400 to-lime-500 text-black font-bold rounded-full text-lg flex items-center space-x-2 hover:shadow-xl hover:shadow-lime-400/25 transition-all"
              >
                <span>Join the Elite</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-8">
              {[
                { icon: Trophy, label: "Champions Trained", value: "50+" },
                { icon: Star, label: "Elite Coaches", value: "3+" },
                { icon: Users, label: "Active Players", value: "100+" },
                { icon: Trophy, label: "Years of Excellence", value: "3+" },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-lime-400/30 transition-colors"
                    >
                      <Icon className="w-8 h-8 text-lime-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Auth Modal */}
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
  );
};

export default LandingPage;