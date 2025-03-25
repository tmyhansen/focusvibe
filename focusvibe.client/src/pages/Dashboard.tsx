import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useSignalR from "../hooks/useSignalR";

const containerClass = "flex flex-row justify-center items-start w-full max-w-6xl mx-auto mt-12 space-x-6";
const columnClass = "flex flex-col items-center w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-4";
const centerColumnClass = "flex flex-col items-center w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-4";
const titleClass = "text-2xl font-bold text-gray-800";
const labelClass = "block text-gray-700 font-medium mb-1";
const inputClass = "w-full p-2 border rounded-lg focus:ring focus:ring-blue-300";
const buttonClass = "w-full py-2 px-4 rounded-lg transition";
const startButtonClass = "bg-blue-500 text-white hover:bg-blue-600";
const notifyButtonClass = "bg-green-500 text-white hover:bg-green-600";
const logoutButtonClass = "bg-red-500 text-white hover:bg-red-600";
const messageClass = "text-red-600";
const successMessageClass = "text-green-600";
const loggedOutTextClass = "text-gray-700";

const profileCardClass = "bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center w-64";
const profilePicClass = "w-24 h-24 rounded-full border-4 border-blue-500 object-cover";
const usernameClass = "text-xl font-semibold mt-3 text-gray-800";
const statsContainerClass = "flex justify-between w-full mt-4";
const statBoxClass = "text-center flex-1";
const statTitleClass = "text-sm font-medium text-gray-600";
const statValueClass = "text-lg font-bold text-gray-800";

const Dashboard: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const [motivationLevel, setMotivationLevel] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionData = useSignalR();
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);

  const profileData = { //TODO: fetch
    username: "Tommy",
    profilePic: "",
    followers: 0,
    following: 0,
    sessions: 0,
  };

  useEffect(() => {
    if (isPermissionGranted) {
      new Notification(sessionData.username + " started a focus session", {
        body: "",
        icon: "",
      });
    }
  }, [sessionData]);

  const handleStartSession = async () => {
    if (!isLoggedIn) {
      setErrorMessage("Must be logged in to start a session");
      return;
    }

    const requestData = { motivationLevel };

    try {
      const response = await fetch("/api/focusapp/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "An error occurred.");
      } else {
        const data = await response.json();
        setSessionId(data.sessionId);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const enableNotifications = () => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setIsPermissionGranted(true);
        }
      });
    } else if (Notification.permission === "granted") {
      setIsPermissionGranted(true);
    }
  };

  return (
    <div className={containerClass}>
      <h1 className={`${titleClass} sr-only`}>Dashboard</h1>
      <div className={columnClass}>
        <div className={profileCardClass}>
          <img src={profileData.profilePic} alt={`${profileData.username}'s profile picture`} className={profilePicClass} />
          <h2 className={usernameClass}>{profileData.username}</h2>
          <div className={statsContainerClass}>
            <div className={statBoxClass}>
              <p className={statValueClass}>{profileData.followers}</p>
              <p className={statTitleClass}>Followers</p>
            </div>
            <div className={statBoxClass}>
              <p className={statValueClass}>{profileData.following}</p>
              <p className={statTitleClass}>Following</p>
            </div>
            <div className={statBoxClass}>
              <p className={statValueClass}>{profileData.sessions}</p>
              <p className={statTitleClass}>Sessions</p>
            </div>
          </div>
        </div>
      </div>

      <div className={centerColumnClass}>
        {isLoggedIn ? (
          <>
            <h2 className={titleClass}>Session</h2>
            <div className="w-full">
              <label htmlFor="motivationLevel" className={labelClass}>Current motivation level (1-10):</label>
              <input
                id="motivationLevel"
                type="number"
                value={motivationLevel}
                onChange={(e) => setMotivationLevel(Number(e.target.value))}
                min="1"
                max="10"
                className={inputClass}
              />
            </div>
            <button onClick={handleStartSession} className={`${buttonClass} ${startButtonClass}`}>
              Start focus session
            </button>
            {sessionId && <p className={successMessageClass} aria-live="polite">Session started. Session ID: {sessionId}</p>}
            {errorMessage && <p className={messageClass} aria-live="assertive">{errorMessage}</p>}
          </>
        ) : (
          <p className={loggedOutTextClass}>You're logged out</p>
        )}
      </div>

      <div className={columnClass}>
        <h2 className={titleClass}>Preferences</h2>
        <button onClick={enableNotifications} className={`${buttonClass} ${notifyButtonClass}`} aria-label="Enable notifications for focus session updates">
              Enable notifications
        </button>
        <button onClick={logout} className={`${buttonClass} ${logoutButtonClass}`}>
              Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
