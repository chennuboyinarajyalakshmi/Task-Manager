import axios from "axios";

export const saveProfile = (token) => async (dispatch) => {
  const API_URL = process.env.REACT_APP_API_URL;
  try {
    const res = await axios.get(`${API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: "SAVE_PROFILE_SUCCESS",
      payload: res.data.user,
    });
  } catch (error) {
    dispatch({
      type: "SAVE_PROFILE_FAILURE",
      payload: error.response?.data?.msg || "Failed to load profile",
    });
  }
};
