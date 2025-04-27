import { startSession, endSession } from "../store/sessionSlice";
import { Dispatch } from "redux";
import { SessionData } from "../types/sessionTypes";
import { AppDispatch, RootState } from "../store";
import { useSelector } from "react-redux";

export const startSessionRequest = async (
    motivationLevel: number,
    plannedDuration: number,
    selectedTask: string,
    dispatch: Dispatch,
    isNotificationPermissionGranted: boolean,
  ) => {
    const requestData = {
      motivationLevel,
      plannedDuration,
      selectedTask,
    };
  
    try {
      const response = await fetch("/api/focussession/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred.");
      }
  
      const data: SessionData = await response.json();
      dispatch(
        startSession({
          sessionId: data.sessionId,
          startTime: data.startTime,
          plannedDuration: data.plannedDuration,
          selectedTask: data.selectedTask,
          motivationLevel: data.motivationLevel,
        })
      );
  
      const user = useSelector((state: RootState) => state.user);
      if (isNotificationPermissionGranted) {
        new Notification(user.username + " started a focus session", {                              
          body: "",
          icon: "",
        });
      }
  
    } catch (error) {
      throw new Error("An unexpected error occurred.");
    }
  };
  
  export const endSessionRequest = async (
    sessionId: string,
    dispatch: Dispatch
  ) => {
    try {
      const response = await fetch(`api/focussession/session/end/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) throw new Error("Failed to end session");
  
      dispatch(endSession());
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  export const fetchCurrentSession = async (dispatch: AppDispatch): Promise<SessionData | null> => {
    try {
      const response = await fetch("/api/focussession/session/current", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred.");
      }
  
      const data: SessionData = await response.json();
      if (data.sessionId) {
        dispatch(startSession(data));
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching current session:", error);
      return null;
    }
  };
  