import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  sessionId: string | null;
  startTime: number | null;
  plannedDuration: number;
  selectedTask: string;
  motivationLevel: number;
}

const loadSessionState = (): SessionState => {
  try {
    const serializedState = localStorage.getItem("session");
    return serializedState
      ? JSON.parse(serializedState)
      : {
          sessionId: null,
          startTime: null,
          plannedDuration: 1,
          selectedTask: "",
          motivationLevel: 5,
        };
  } catch (error) {
    console.error("Could not load session state:", error);
    return {
      sessionId: null,
      startTime: null,
      plannedDuration: 1,
      selectedTask: "",
      motivationLevel: 5,
    };
  }
};

const saveSessionState = (state: SessionState) => {
  try {
    localStorage.setItem("session", JSON.stringify(state));
  } catch (error) {
    console.error("Could not save session state:", error);
  }
};

const sessionSlice = createSlice({
  name: "session",
  initialState: loadSessionState(),
  reducers: {
    startSession: (
      state,
      action: PayloadAction<{
        sessionId: string;
        startTime: number;
        plannedDuration: number;
        selectedTask: string;
        motivationLevel: number;
      }>
    ) => {
      Object.assign(state, action.payload);
      saveSessionState(state);
    },
    endSession: () => {
      localStorage.removeItem("session");
      const newState = {
        sessionId: null,
        startTime: null,
        plannedDuration: 1,
        selectedTask: "",
        motivationLevel: 5,
      };
      saveSessionState(newState);
      return newState;
    },
  },
});

export const { startSession, endSession } = sessionSlice.actions;
export default sessionSlice.reducer;