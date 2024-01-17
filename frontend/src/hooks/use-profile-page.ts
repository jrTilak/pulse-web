import { ProfilePageContextType } from "@/contexts/profile-page-context";
import { createContext, useContext } from "react";

// Create the auth context
export const ProfilePageContext = createContext<
  ProfilePageContextType | undefined
>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useProfilePageContext = (): ProfilePageContextType => {
  const context = useContext(ProfilePageContext);
  if (!context) {
    throw new Error(
      "useProfilePageContext must be used within an Profile Page Context Provider"
    );
  }
  return context;
};
