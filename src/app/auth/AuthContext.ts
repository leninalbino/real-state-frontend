import { createContext } from "react";

// Define the shape of the user object
export type User = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: "buyer" | "agent" | "admin";
  status: "active" | "suspended";
};

export type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
