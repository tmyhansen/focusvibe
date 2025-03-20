import React, { useState } from 'react';
import './App.css';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';

const containerClass = "flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 flex-col pt-24";
const headerClass = "fixed top-0 left-0 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 flex flex-col items-center";
const logoClass = "text-4xl font-bold";
const sloganClass = "text-sm mt-2";
const buttonClass = "mb-6 py-2 px-4 bg-blue-500 text-white rounded";
const orTextClass = "mb-6 text-gray-700";

const App = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { isLoggedIn, logout } = useAuth();

    if (isLoggedIn === undefined) {
        return <div>Loading...</div>;
    }

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div>
            <header className={headerClass}>
                <h1 className={logoClass}>FocusVibe</h1>
                <p className={sloganClass}>Beyond Discipline</p>
            </header>
            <div className={containerClass}>
                {isLoggedIn ? (
                    <Dashboard />
                ) : (
                        <>
                            <button
                                onClick={toggleForm}
                                className={buttonClass}
                            >
                                {isLogin ? 'Sign Up' : 'Back to Login'}
                            </button>
                            <span className={orTextClass}>or</span>
                            <div>
                                {isLogin ? <Login /> : <SignUp />}
                            </div>
                        </>
                )}
            </div>
        </div>
    );
};

export default App;