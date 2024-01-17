import { ProfilePageContextProvider } from "@/contexts/profile-page-context";
import ProfileComp from "./profile-comp";

const ProfilePage = () => {
  return (
    <ProfilePageContextProvider>
      <ProfileComp/>
    </ProfilePageContextProvider>
  );
};
export default ProfilePage;
