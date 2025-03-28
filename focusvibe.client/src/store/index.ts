import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import sessionReducer from "./sessionSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    session: sessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;