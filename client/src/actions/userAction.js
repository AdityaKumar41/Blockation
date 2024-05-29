import axios from "axios";
import {
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_USER_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
} from "../constants/userConstants";

// Helper function to get cookie by name
const getCookie = (name) => {
  const cookieValue = document.cookie.match(
    "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  return cookieValue ? cookieValue.pop() : "";
};

// Load user details from JWT on page load
export const loadUserFromCookies = () => async (dispatch) => {
  const token = getCookie("token");
  if (token) {
    try {
      dispatch({ type: LOAD_USER_REQUEST });
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `https://hammerhead-app-jyvj3.ondigitalocean.app/auth/me`,
        config
      );
      dispatch({ type: LOAD_USER_SUCCESS, payload: data.userDetails });
    } catch (error) {
      dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
    }
  } else {
    dispatch({ type: LOAD_USER_FAIL, payload: "No token found" });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(
      `https://hammerhead-app-jyvj3.ondigitalocean.app/auth/login`,
      { email, password },
      config
    );

    // Set JWT cookie here
    if (data && data.success) {
      document.cookie = `token=${data.token}; path=/;`;
      dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    } else {
      dispatch({ type: LOGIN_FAIL, payload: "Login failed" });
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error.response.data.message });
  }
};

// Logout user and clear user state
export const logout = () => async (dispatch) => {
  try {
    await axios.get(
      `https://hammerhead-app-jyvj3.ondigitalocean.app/auth/logout`
    );

    // Clear JWT cookie on logout
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message });
  }
};

// Register User
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      "https://hammerhead-app-jyvj3.ondigitalocean.app/auth/register",
      userData,
      config
    );
    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.newUser });
  } catch (error) {
    dispatch({ type: REGISTER_USER_FAIL, payload: error.message });
  }
};

// Load user details (used if token is already present in cookies)
export const laodUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const token = getCookie("token");
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `https://hammerhead-app-jyvj3.ondigitalocean.app/auth/me`,
        config
      );
      dispatch({ type: LOAD_USER_SUCCESS, payload: data.userDetails });
    } else {
      dispatch({ type: LOAD_USER_FAIL, payload: "No token found" });
    }
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
  }
};
