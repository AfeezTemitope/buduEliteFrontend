import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import News from "./pages/News";
import PlayerSpotlight from "./pages/PlayerSpotlight";
import ComingSoon from "./pages/ComingSoon";
import Store from "./pages/Store";

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-black">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/players" element={<PlayerSpotlight />} />
          <Route
            path="/live"
            element={
              <ComingSoon
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
            }
          />
          <Route
            path="/leagues"
            element={
              <ComingSoon
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
            }
          />
          <Route path="/store" element={<Store />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2939",
              color: "#ffffff",
              border: "1px solid #374151",
            },
            success: {
              iconTheme: {
                primary: "#32cd32",
                secondary: "#000000",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;