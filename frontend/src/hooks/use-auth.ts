import { AuthContextType } from "@/contexts/auth-context";
import { createContext, useContext } from "react";

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
