import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/Auth";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import SignupPage from "./Pages/SignupPage/SignupPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import { PrivateRoute } from "./Pages/PrivateRoute/PrivateRoute";

function App() {
    return (
        <div>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
