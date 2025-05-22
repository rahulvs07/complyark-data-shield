
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types/models";
import { toast } from "@/hooks/use-toast";
import db from "@/services/mockDatabase";

type AuthUser = Omit<User, "password">;

interface AuthContextType {
  user: AuthUser | null;
  isSystemAdmin: boolean;
  isOrgAdmin: boolean;
  isUser: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  organisationId: number;
  organisationName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("complyark_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = db.login(email, password);
      
      if (result) {
        setUser(result);
        localStorage.setItem("complyark_user", JSON.stringify(result));
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.firstName}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("complyark_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Derived values
  const isSystemAdmin = user?.organisationId === 0;
  const isOrgAdmin = user?.role === "admin" && user.organisationId !== 0;
  const isUser = user?.role === "user";
  const organisationId = user?.organisationId || 0;
  const organisationName = user?.organisationName || "";

  return (
    <AuthContext.Provider
      value={{
        user,
        isSystemAdmin,
        isOrgAdmin,
        isUser,
        loading,
        login,
        logout,
        organisationId,
        organisationName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
