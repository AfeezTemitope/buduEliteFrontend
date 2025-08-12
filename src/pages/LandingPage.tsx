import type React from "react";
import { Star, Trophy, Users } from "lucide-react";
import TrainingSchedule from "../components/dashboard/TrainingSchedule.tsx";

const LandingPage: React.FC = () => {
    return (
        <div className="w-full min-h-screen bg-black text-white flex flex-col">
            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16 py-16">
                <div className="max-w-6xl mx-auto w-full text-center">
                    {/* Title */}
                    <div className="mb-10">
                        <h1
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                            style={{
                                background:
                                    "linear-gradient(135deg, #ffffff 0%, #32cd32 50%, #ffffff 100%)",
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
                            <span className="text-lime-400 font-semibold">
                nurturing world-class football talent
              </span>{" "}
                            and developing champions both on and off the field through elite
                            training, mentorship, and cutting-edge technology.
                        </p>
                    </div>

                    {/* Training Schedule */}
                    <div className="mb-16">
                        <TrainingSchedule />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4 sm:px-8">
                        {[
                            { icon: Trophy, label: "Champions Trained", value: "50+" },
                            { icon: Star, label: "Elite Coaches", value: "3" },
                            { icon: Users, label: "Active Players", value: "100+" },
                            { icon: Trophy, label: "Years of Excellence", value: "2" },
                        ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-lime-400/30 transition-colors shadow-lg"
                                >
                                    <Icon className="w-10 h-10 text-lime-400 mx-auto mb-4" />
                                    <div className="text-3xl font-bold text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-400 text-sm">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
