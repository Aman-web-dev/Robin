"use client";

import React, { useContext, createContext, useState, ReactNode ,useEffect} from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
}

type DecodedToken = {
  exp: number;
};

interface AuthContextType {
  user: User | null;
  login: (user: User,token:string) => void;
  logout: () => void;
  isAuthenticated:()=> void;
  isLoggedIn:boolean;
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

  const isAuthenticated = () => {
    if (typeof window === "undefined") return;
    const data = sessionStorage.getItem("robinLoginDetails");
    console.log("data",data)
    if (!data) return;

    const { user, token } = JSON.parse(data);

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp > currentTime) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        sessionStorage.removeItem("robinLoginDetails");
        setUser(null);
        logout()
      }
    } catch (error) {
      console.error("Invalid token:", error);
      sessionStorage.removeItem("robinLoginDetails");
      setUser(null);
    }
  };



  const login = (user: User, token: string) => {
    console.log("login is Called",user,token)
    if (typeof window === "undefined") return;
    setUser(user);
    setIsLoggedIn(true);
    sessionStorage.setItem(
      "robinLoginDetails",
      JSON.stringify({ user, token })
    );
  };

  const logout = () => {
    if (typeof window === "undefined") return;
    setUser(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem("robinLoginDetails");
  };

  useEffect(()=>{
    isAuthenticated();
  },[])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated,isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
