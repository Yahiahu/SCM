"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";

interface AuthContextType {
  isLoggedIn: boolean;
  logout: () => void;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const user = session?.user ?? null;

  const logout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
