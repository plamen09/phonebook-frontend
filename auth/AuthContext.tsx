import {
  Children,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthClient, authClient } from "../src/api/client/auth";
import { AuthContextType } from "../src/types/Authentication";
import { User } from "../src/types/users";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const validateToken = async () => {
    setLoading(true);

    try {
      const data = await authClient.validate();
      if (data.valid) {
        setIsAuthenticated(true);
        const currentUser: User = data.user ?? {
          ID: data.user_id,
          is_admin: data.is_admin,
        };
        setUser(currentUser);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    validateToken();
  }, []);
  const logout = async () => {
    await authClient.logout();
    setUser(null);
    setIsAuthenticated(false);
  };
  const isAdmin = Boolean(user?.is_admin);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAdmin,
        loading,
        logout,
        setIsAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside Authprovider");
  }
  return context;
}
