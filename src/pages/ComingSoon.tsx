import React from "react";
import { Clock, CheckCircle } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  features: string[];
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description, features }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-12 h-12 text-lime-400" />
              <span className="bg-lime-400/20 text-lime-400 px-4 py-2 rounded-full text-lg font-semibold">
                Coming Soon
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white">{title}</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">{description}</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">What to Expect</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-lime-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-lime-400/10 border border-lime-400/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
            <p className="text-gray-400">
              We're working hard to bring you these amazing features. Keep checking back for updates!
            </p>
          </div>

          <div className="text-6xl">🚀</div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;