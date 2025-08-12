import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Dashboard from "./pages/Dashboard.tsx";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={ <Dashboard /> } />
                </Routes>

                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 500,
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
    )
}

export default App
