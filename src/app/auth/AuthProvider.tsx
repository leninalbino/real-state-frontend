import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import { login as loginService, register as registerService } from "../../features/auth/services/authService";

const STORAGE_TOKEN_KEY = "authToken";
const STORAGE_USER_KEY = "authUser";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      const storedUser = localStorage.getItem(STORAGE_USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load auth state from storage", error);
      // Clear potentially corrupted storage
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login: async (email: string, password: string) => {
        const result = await loginService(email, password);
        setToken(result.token);
        setUser(result.user);
        localStorage.setItem(STORAGE_TOKEN_KEY, result.token);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(result.user));
      },
      register: async (data: {
        email: string;
        password: string;
        fullName: string;
        phone?: string;
      }) => {
        const result = await registerService(data);
        setToken(result.token);
        setUser(result.user);
        localStorage.setItem(STORAGE_TOKEN_KEY, result.token);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(result.user));
      },
      logout: () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
      },
      isAuthenticated: !isLoading && user !== null,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
