import { Button } from "../../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Input } from "../../ui/input";
import { useState } from "react";
import Loading from "react-loading";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/use-auth";
import { UserAuthHandler } from "@/handlers/auth-handlers";
import { AuthValidator } from "@/validators/auth-validators";
const GuestLogin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setCurrentUser, setIsAuthenticated } = useAuthContext();

  const handleSubmit = async () => {
    const isValid = AuthValidator.validateGuestUser(name);
    if (!isValid.success) {
      toast({
        title: "Error",
        description: isValid.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    const res = await UserAuthHandler.createGuestUser(isValid.data);
    setIsSubmitting(false);
    if (!res.success) {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
      return;
    }
    setCurrentUser(res.data);
    setIsAuthenticated(true);
    navigate("/feed");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          className="z-10 flex items-center w-full max-w-xs gap-4 shadow-sm hover:shadow"
        >
          {isSubmitting ? (
            <Loading type="spin" color="#000" height={20} width={20} />
          ) : (
            <>
              <img
                src="https://www.svgrepo.com/show/314962/avatar.svg"
                className="w-4 h-4"
              />
              <span>Continue as Guest</span>
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter you name !</AlertDialogTitle>
          <AlertDialogDescription>
            <Input
              autoFocus
              type="text"
              name="name"
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setName("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default GuestLogin;
