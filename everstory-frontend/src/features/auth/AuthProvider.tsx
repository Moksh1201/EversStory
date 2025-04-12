import { createContext, useContext, ReactNode, useEffect } from "react";
import { useAuthStore } from "./useAuth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setUserFromToken } = useAuthStore();

  useEffect(() => {
    setUserFromToken(); // persist session on reload
  }, [setUserFromToken]);

  return <>{children}</>;
};
