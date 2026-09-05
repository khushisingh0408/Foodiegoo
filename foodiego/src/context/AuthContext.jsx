import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("foodieGoToken") || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("foodieGoUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!token && !!user;

  // Verify token and fetch fresh user profile on startup
  useEffect(() => {
    async function checkAuth() {
      if (token) {
        const res = await api.get("/auth/me");
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem("foodieGoUser", JSON.stringify(res.user));
          localStorage.setItem("isLoggedIn", "true");
        } else if (res.status === 401 || res.status === 403) {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    }

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("foodieGoToken", res.token);
      localStorage.setItem("foodieGoUser", JSON.stringify(res.user));
      localStorage.setItem("isLoggedIn", "true");
      return { success: true, message: res.message, user: res.user };
    }
    return { success: false, message: res.message || "Login failed." };
  };

  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("foodieGoToken", res.token);
      localStorage.setItem("foodieGoUser", JSON.stringify(res.user));
      localStorage.setItem("isLoggedIn", "true");
      return { success: true, message: res.message, user: res.user };
    }
    return { success: false, message: res.message || "Registration failed." };
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("foodieGoToken");
    localStorage.removeItem("foodieGoUser");
    localStorage.removeItem("isLoggedIn");
  };

  const updateProfile = async (profileData) => {
    const res = await api.put("/auth/profile", profileData);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem("foodieGoUser", JSON.stringify(res.user));
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message };
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoggedIn,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
