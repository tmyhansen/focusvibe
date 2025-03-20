import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>Welcome to the dashboard</h1>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <><p>You're logged out</p></>
      )}
    </div>
  );
};

export default Dashboard;
