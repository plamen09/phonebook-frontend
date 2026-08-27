import { User } from "./users";

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
};
