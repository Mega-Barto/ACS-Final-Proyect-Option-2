import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../config";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  deleteAccount: async () => {},
});

interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  exp: number;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configure axios instance with token
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  };

  // Check if token exists and is valid on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        // Check if token is expired
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          setAuthToken(null);
          setLoading(false);
          return;
        }

        // Token is valid, set auth state
        setAuthToken(token);
        setUser({
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
        });
        setIsAuthenticated(true);

        // Verify token with backend
        await axios.get(`${API_URL}/users/me`);
      } catch (error) {
        console.error("Auth error:", error);
        setAuthToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Login user
  const login = async (email: string, password: string) => {
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "password"); // importante para OAuth2
      params.append("username", email);
      params.append("password", password);
      params.append("scope", "");
      params.append("client_id", "");
      params.append("client_secret", "");

      const response = await axios.post(`${API_URL}/auth/login`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token } = response.data;
      setAuthToken(access_token);

      const decoded = jwtDecode<DecodedToken>(access_token);
      setUser({
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
      });

      setIsAuthenticated(true);
    } catch (error) {
      setAuthToken(null);
      throw error;
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      // After registration, login the user
      await login(email, password);
      console.log("User registered successfully");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await axios.put(`${API_URL}/users/me`, data);

      setUser((prev) => {
        if (!prev) return null;
        return { ...prev, ...response.data };
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Delete user account (logical deletion)
  const deleteAccount = async () => {
    try {
      await axios.delete(`${API_URL}/users/me`);
      logout();
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
