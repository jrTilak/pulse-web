import { useToast } from "../../../hooks/use-toast";
import { Button } from "../../ui/button";

const GoogleLogin = () => {
  const { toast } = useToast();
  const handleGoogleLogin = async () => {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Google login is not available yet.",
    });
  };
  return (
    <Button
      variant="ghost"
      className="z-10 flex items-center w-full max-w-xs gap-4 shadow-sm hover:shadow"
      onClick={handleGoogleLogin}
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        className="w-4 h-4"
      />
      <span>Continue with Google</span>
    </Button>
  );
};
export default GoogleLogin;
