import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string | null;
  profilePic: string | null;
  followersAmount: number;
  followingAmount: number;
  sessionsAmount: number;
}

const loadState = (): UserState => {
  try {
    const serializedState = localStorage.getItem("user");
    return serializedState ? JSON.parse(serializedState) : {
      username: "",
      profilePic: "",
      followersAmount: 0,
      followingAmount: 0,
      sessionsAmount: 0,
    };
  } catch (error) {
    console.error("Could not load user state:", error);
    return {
      username: "",
      profilePic: "",
      followersAmount: 0,
      followingAmount: 0,
      sessionsAmount: 0,
    };
  }
};

const saveState = (state: UserState) => {
  try {
    localStorage.setItem("user", JSON.stringify(state));
  } catch (error) {
    console.error("Could not save user state:", error);
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: loadState(),
  reducers: {
    startUser: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, action.payload);
      saveState(state);
    },
    endUser: () => {
      localStorage.removeItem("user");
      const newState = {
        username: "",
        profilePic: "",
        followersAmount: 0,
        followingAmount: 0,
        sessionsAmount: 0,
      };
        saveState(newState);
      return newState;
    },
  },
});

export const { startUser, endUser } = userSlice.actions;
export default userSlice.reducer;