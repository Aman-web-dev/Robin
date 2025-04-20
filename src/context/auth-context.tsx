"use client";

import React, { useContext, createContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface DecodedToken {
  exp: number;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const isAuthenticated = (): boolean => {
    console.log("isAuthenticated Called");
    if (typeof window === "undefined") return false;

    const data = sessionStorage.getItem("robinLoginDetails");
    console.log("data", data);
    if (!data) return false;

    try {
      const { user, token } = JSON.parse(data);
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp > currentTime) {
        return true;
      } else {
        sessionStorage.removeItem("robinLoginDetails");
        return false;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      sessionStorage.removeItem("robinLoginDetails");
      return false;
    }
  };

  const login = (user: User, token: string) => {
    console.log("login is Called", user, token);
    if (typeof window === "undefined") return;
    console.log("Pre User Setup User", user)
    setUser(user);
    setIsLoggedIn(true);
    sessionStorage.setItem("robinLoginDetails", JSON.stringify({ user, token }));
    // router.push("/dashboard");
  };

  const logout = () => {
    console.log("logout called");
    if (typeof window === "undefined") return;
    setUser(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem("robinLoginDetails");
    router.push("/auth/login");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuth = () => {
      const isAuth = isAuthenticated();
      if (isAuth) {
        setUser(JSON.parse(sessionStorage.getItem("robinLoginDetails")!).user);
        setIsLoggedIn(true);
        // router.push("/dashboard");
      } else {
        setUser(null);
        setIsLoggedIn(false);
        // Optionally redirect to login if not authenticated
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};