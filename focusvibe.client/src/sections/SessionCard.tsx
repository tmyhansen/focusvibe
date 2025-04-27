import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { motion } from "framer-motion";
import useSessionProgress from "../hooks/useSessionProgress";
import * as styles from "../styles/tailwindStyles";
import { endSessionRequest, startSessionRequest } from "../services/sessionService";
import { fetchUserData } from "../services/userService";

interface SessionCardProps {
  isLoggedIn: boolean;
  isNotificationPermissionGranted: boolean;
  enableNotifications: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  isLoggedIn, 
  isNotificationPermissionGranted, 
}) => {
  const [plannedDuration, setPlannedDuration] = useState(1);
  const [motivationLevel, setMotivationLevel] = useState(5);
  const [selectedTask, setSelectedTask] = useState("Office work");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEndingSession, setIsEndingSession] = useState(false);

  const dispatch = useDispatch();
  const session = useSelector((state: RootState) => state.session);

  const handleStartSession = async () => {
    if (!isLoggedIn) {
      setErrorMessage("Must be logged in to start a session");
      return;
    }

    try {
      await startSessionRequest(
        motivationLevel,
        plannedDuration,
        selectedTask,
        dispatch,
        isNotificationPermissionGranted,
      );
    } catch (error) {
      setErrorMessage("Error starting session");
    }

    try {
        await fetchUserData(dispatch);
      } catch (error) {
        setErrorMessage("Error fetching user data");
      }
  };

  const handleEndSession = async () => {
    if (!session || !session.sessionId) return;

    setIsEndingSession(true);

    try {
      await endSessionRequest(session.sessionId, dispatch);
    } catch (error) {
      setErrorMessage("Error ending session");
    } finally {
      setIsEndingSession(false);
    }
  };

  const progress = useSessionProgress();

  return (
    <motion.div
      className={styles.columnClass}
      initial={{ scale: 1 }}
      animate={{ scale: session.sessionId ? 2 : 1 }}
      transition={{ duration: 0.5 }}
    >
      {!session.sessionId ? (
        <div className="pre-session space-y-6">
          <h2 className={styles.titleClass}>Session</h2>
          <div className="w-full">
            <label htmlFor="taskSelector" className={styles.labelClass}>What will you do in this session?</label>
            <select id="taskSelector" value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className={styles.taskSelectorClass}>
              <option>Office work</option>
              <option>Studying</option>
              <option>Read book</option>
              <option>House chores</option>
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="motivationLevel" className={styles.labelClass}>How motivated are you right now? (scale 1-10)</label>
            <input
              id="motivationLevel"
              type="number"
              value={motivationLevel}
              onChange={(e) => setMotivationLevel(Number(e.target.value))}
              min="1"
              max="10"
              className={styles.motivationLevelClass}
            />
          </div>
          <div className="w-full">
            <label htmlFor="plannedDuration" className={styles.labelClass}>How long are you planning the session to last? (in hours)</label>
            <input
              id="plannedDuration"
              type="number"
              value={plannedDuration}
              onChange={(e) => setPlannedDuration(Number(e.target.value))}
              min="1"
              max="10"
              className={styles.plannedDurationClass}
            />
          </div>
          <button onClick={handleStartSession} className={`${styles.buttonClass} ${styles.startButtonClass}`}>
            Start focus session
          </button>
        </div>
      ) : (
        <div className="in-session space-y-4">
          <h2 className={styles.titleClass}>My session</h2>
          <div className={styles.progressBarClass}>
            <div
              className={progress.progress == 100 ? styles.finishedFillClass : styles.progressFillClass}
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <p className={progress.progress == 100 ? styles.successMessageClass : styles.inProgressMessageClass}>
            {progress.elapsedHours > 0 ? progress.elapsedHours + " h" : ""} {progress.elapsedMinutes + " min"} ({progress.progress.toFixed(1)}%)
          </p>
          <div className="bg-gray-100 p-4 rounded-lg shadow space-y-2">
            <p className="text-lg font-medium text-gray-700">
              <strong>Task:</strong> {session.selectedTask}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>Motivation:</strong> {session.motivationLevel}/10
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>Planned duration:</strong> {session.plannedDuration} hours
            </p>
          </div>
          <button
            className={styles.endSessionButtonClass}
            onClick={handleEndSession}
            disabled={isEndingSession}
          >
            {isEndingSession ? "Ending..." : "End session"}
          </button>
        </div>
      )}
      {errorMessage && <p className={styles.messageClass}>{errorMessage}</p>}
    </motion.div>
  );
};

export default SessionCard;