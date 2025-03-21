import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const [motivationLevel, setMotivationLevel] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleStartSession = async () => {
    if (!isLoggedIn) {
      setErrorMessage('Must be logged in to start a session');
      return;
    }

    const requestData = {
      motivationLevel,
    };

    try {
      const response = await fetch('/api/focusapp/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'An error occurred.');
      } else {
        const data = await response.json();
        setSessionId(data.sessionId);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>Welcome to the dashboard</h1>
          <div>
            <label>Motivation level (1-10): </label>
            <input
              type="number"
              value={motivationLevel}
              onChange={(e) => setMotivationLevel(Number(e.target.value))}
              min="1"
              max="10"
            />
          </div>
          <button onClick={handleStartSession}>Start focus session</button>
          {sessionId && <p>Session started. Session ID: {sessionId}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>You're logged out</p>
      )}
    </div>
  );
};

export default Dashboard;