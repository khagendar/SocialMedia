import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './logincomponents/login.js';
import GenerateChatApp from '../src/chatApplication/GenerateChatApp.js';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import BackgroundComponent from './background/background.js';
import UserRoutes from './Routes/UserRoute.js';
import PublicRoutes from './Routes/PublicRoutes'; // Import the new PublicRoutes component
import { AuthProvider } from './Routes/AuthContex.js';
import ForgotPassword from './forgotPassword/forgotpassword.js';
import CreateProfile from './CreateUser/CreateProfile.js';
import Home from './Home/home.js';
import Profile from './Profile/profile.js';
import Createpost from './CreatePost/Createpost.js';
import ProfielSearch from './ProfileSearch/ProfileSearch.js';
import ErrorPage from './Error.js';
import Terms from './Terms&Conditions/Terms';
import Settings from './Settings/Settings.js';
import Location from '../src/Location/Location.js';
function AppContent() {
    const location = useLocation();
    const isBackgroundVisible = location.pathname === '/signin' || location.pathname === '/signup';

    return (
        <AuthProvider>
            <BackgroundComponent isBackgroundVisible={isBackgroundVisible}>
                <div className="App">
                    <ToastContainer />
                    <Routes>
                        {/* Redirect to Sign In by default */}
                        <Route path='/' element={<Navigate to="/signin" />} />

                        {/* Public Routes */}
                        <Route element={<PublicRoutes />}>
                            <Route path='/signin' element={<Login action="Sign In" />} />
                            <Route path='/signup' element={<Login action="Sign Up" />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path='/TermsAndConditions' element={<Terms />} />
                        </Route>

                        {/* Protected Routes */}
                        <Route element={<UserRoutes />}>
                            <Route path='/chat' element={<GenerateChatApp />} />
                            <Route path="/CreateProfile" element={<CreateProfile />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/Profile" element={<Profile />} />
                            <Route path='/Createpost' element={<Createpost />} />
                            <Route path='/Search' element={<ProfielSearch />} />
                            <Route path="/Profile/:userId" element={<Profile />} />
                            <Route path="/settings/*" element={<Settings />} />
                            <Route path="/Location" element={<Location/>} />
                        </Route>

                        {/* Error Page Route */}
                        <Route path="/error" element={<ErrorPage />} />
                    </Routes>
                </div>
            </BackgroundComponent>
        </AuthProvider>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
