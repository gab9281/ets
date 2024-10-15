import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Page main
import Home from './pages/Home/Home';

// Pages espace enseignant
import Dashboard from './pages/Teacher/Dashboard/Dashboard';
import Share from './pages/Teacher/Share/Share';
import Register from './pages/AuthSelection/providers/SimpleLogin/Register';
import ResetPassword from './pages/AuthSelection/providers/SimpleLogin/ResetPassword';
import ManageRoom from './pages/Teacher/ManageRoom/ManageRoom';
import QuizForm from './pages/Teacher/EditorQuiz/EditorQuiz';

// Pages espace étudiant
import JoinRoom from './pages/Student/JoinRoom/JoinRoom';

// Pages authentification selection
import AuthDrawer from './pages/AuthSelection/AuthDrawer';

// Header/Footer import
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import ApiService from './services/ApiService';
import OAuthCallback from './pages/AuthSelection/callback/AuthCallback';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(ApiService.isLoggedIn()); // Initial check
    const location = useLocation(); // Hook to detect route changes

    // Check login status every time the route changes
    useEffect(() => {
        const checkLoginStatus = () => {
            const loggedIn = ApiService.isLoggedIn();
            setIsAuthenticated(loggedIn); // Update state if login status changes
            console.log('App.tsx - Login status:', loggedIn);
        };

        checkLoginStatus(); // Check login status whenever the route changes
    }, [location]); // Re-run when the location (route) changes

    const handleLogout = () => {
        ApiService.logout();
        setIsAuthenticated(false); // Ensure we log out the user in the state as well
    };

    return (
        <div className="content">
            <Header isLoggedIn={isAuthenticated} handleLogout={handleLogout} />
            <div className="app">
                <main>
                    <Routes>
                        {/* Page main */}
                        <Route path="/" element={<Home />} />

                        {/* Pages espace enseignant */}
                        <Route
                            path="/teacher/dashboard"
                            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/teacher/share/:id"
                            element={isAuthenticated ? <Share /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/teacher/editor-quiz/:id"
                            element={isAuthenticated ? <QuizForm /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/teacher/manage-room/:id"
                            element={isAuthenticated ? <ManageRoom /> : <Navigate to="/login" />}
                        />

                        {/* Pages espace étudiant */}
                        <Route
                            path="/student/join-room"
                            element={isAuthenticated ? <JoinRoom /> : <Navigate to="/login" />}
                        />

                        {/* Pages authentification */}
                        <Route path="/login" element={<AuthDrawer />} />

                        {/* Pages enregistrement */}
                        <Route path="/register" element={<Register />} />

                        {/* Pages rest password */}
                        <Route path="/resetPassword" element={<ResetPassword />} />

                        {/* Pages authentification sélection */}
                        <Route path="/auth/callback" element={<OAuthCallback />} />
                    </Routes>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default App;
