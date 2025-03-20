import React, { useState } from 'react';
import './App.css';

interface User {
    userName: string;
    email: string;
    password: string;
}

const App = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegisterClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
    
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
    
        const newUser: User = {
            userName,
            email,
            password,
        };
    
        try {
            const response = await fetch('/api/focusapp/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
    
            if (response.ok) {
                alert('User registered successfully');
            } else {
                alert('Failed to register user');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error occurred while registering the user');
        }
    };
    

    const containerClass = "flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200";
    const formContainerClass = "max-w-md w-full bg-white p-8 rounded-lg shadow-xl";
    const headerClass = "text-3xl font-semibold text-center text-gray-800 mb-6";
    const inputGroupClass = "space-y-4";
    const labelClass = "block text-lg font-medium text-gray-600";
    const inputClass = "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
    const errorMessageClass = "text-red-500 text-sm";
    const buttonClass = "w-full py-3 mt-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";


    return (
        <div className={containerClass}>
            <div className={formContainerClass}>
                <h1 className={headerClass}>Focus Vibe - Register</h1>
                <form onSubmit={handleRegisterClick} className={inputGroupClass}>
                    <div>
                        <label htmlFor="userName" className={labelClass}>User name:</label>
                        <input
                            type="text"
                            id="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelClass}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className={labelClass}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className={labelClass}>Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>
                    {error && <div className={errorMessageClass}>{error}</div>}
                    <button type="submit" className={buttonClass}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );    
};

export default App;
