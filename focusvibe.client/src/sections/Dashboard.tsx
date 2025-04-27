import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useSessionsSignalR from "../hooks/useSessionsSignalR";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { fetchCurrentSession } from "../services/sessionService";
import { ProfileData } from "../types/userTypes";
import * as styles from "../styles/tailwindStyles";
import SessionCard from "./SessionCard";
import { fetchUserData } from "../services/userService";
import placeholderImage from "../assets/profile_placeholder.svg";

const Dashboard: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [isNotificationPermissionGranted, setIsNotificationPermissionGranted] = useState<boolean>(false);
  const allSessionsData = useSessionsSignalR();

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if ((!user.username || user.username == "") && isLoggedIn) {
      fetchUserData(dispatch)
      .catch((error) => setErrorMessage(error.message));
      fetchCurrentSession(dispatch)
      .catch((error) => setErrorMessage(error.message));
    }
  }, [dispatch]);

  const profileData: ProfileData = {
    username: user.username || "",
    profilePic: user.profilePic || placeholderImage,
    followersAmount: user.followersAmount,
    followingAmount: user.followingAmount,
    sessionsAmount: user.sessionsAmount,
  };

  const enableNotifications = async () => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setIsNotificationPermissionGranted(true);
        }
      });
    } else if (Notification.permission === "granted") {
      setIsNotificationPermissionGranted(true);
    }
  };

  return (
    <div className={styles.mainContainerClass}>
      <div className={styles.containerClass}>
        <div className={styles.columnClass}>
          <div className={styles.profileCardClass}>
            <img src={profileData.profilePic ?? ""} alt={`${profileData.username}'s profile picture`} className={styles.profilePicClass} />
            <h2 className={styles.usernameClass}>{profileData.username}</h2>
            <div className={styles.statsContainerClass}>
              <div className={styles.statBoxClass}>
                <p className={styles.statValueClass}>{profileData.followersAmount}</p>
                <p className={styles.statTitleClass}>Followers</p>
              </div>
              <div className={styles.statBoxClass}>
                <p className={styles.statValueClass}>{profileData.followingAmount}</p>
                <p className={styles.statTitleClass}>Following</p>
              </div>
              <div className={styles.statBoxClass}>
                <p className={styles.statValueClass}>{profileData.sessionsAmount}</p>
                <p className={styles.statTitleClass}>Sessions</p>
              </div>
            </div>
          </div>
          <h2 className={styles.titleClass}>Active user sessions</h2>
          {allSessionsData && allSessionsData.length > 0 ? (
            <ul className="w-full space-y-2">
              {allSessionsData.map((sessionUser) => (
                <li key={sessionUser.id} className="p-2 bg-gray-100 rounded-lg shadow">
                  <p className="text-lg font-medium text-gray-800">{sessionUser.username}</p>
                </li>
              ))}
            </ul>
          ) : <div>No sessions</div>}
        </div>
        <div className={styles.centerColumnClass}>
        <SessionCard 
            isLoggedIn={isLoggedIn}
            isNotificationPermissionGranted={isNotificationPermissionGranted}
            enableNotifications={enableNotifications}
          />
        </div>
  
        <div className={styles.preferencesClass}>
          <h2 className={styles.titleClass}>Preferences</h2>
          <button onClick={enableNotifications} className={`${styles.preferencesButtonClass} ${styles.notifyButtonClass}`} aria-label="Enable notifications for focus session updates">
            Enable notifications
          </button>
          <button onClick={logout} className={`${styles.preferencesButtonClass} ${styles.logoutButtonClass}`}>
            Logout
          </button>
        </div>
      </div>
      {errorMessage && <p className={styles.messageClass} aria-live="assertive">{errorMessage}</p>}
    </div>
  );
};

export default Dashboard;
