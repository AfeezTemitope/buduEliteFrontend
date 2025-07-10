"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/authStore"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"

function App() {
    const { isAuthenticated, refreshAuthToken } = useAuthStore()

    useEffect(() => {
        // Try to refresh token on app load if user is authenticated
        if (isAuthenticated) {
            refreshAuthToken()
        }
    }, [isAuthenticated, refreshAuthToken])

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
                    <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} />
                </Routes>

                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: "#1f2937",
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
    )
}

export default App
