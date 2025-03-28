import { startUser } from "../store/userSlice";
import { ProfileData } from "../types/userTypes";
import { AppDispatch } from "../store/index";

export const fetchUserData = async (dispatch: AppDispatch) => {
    try {
      const response = await fetch("/api/user/current-user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred.");
      } else {
        const data: ProfileData = await response.json();
        dispatch(
          startUser({
            username: data.username,
            profilePic: data.profilePic,
            followersAmount: data.followersAmount,
            followingAmount: data.followingAmount,
            sessionsAmount: data.sessionsAmount,
          })
        );
      }
    } catch (error) {
      throw new Error("An unexpected error occurred.");
    }
  };