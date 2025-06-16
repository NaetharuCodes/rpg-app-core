// rpg-ui/src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  verifyToken: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = "http://localhost:8080";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        const isValid = await verifyToken(token);
        if (!isValid) {
          localStorage.removeItem("auth_token");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE}/auth/google`;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid && data.user) {
          // Only update user if it's different
          setUser((prevUser) => {
            if (!prevUser || prevUser.id !== data.user.id) {
              return data.user;
            }
            return prevUser;
          });
          localStorage.setItem("auth_token", token);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
