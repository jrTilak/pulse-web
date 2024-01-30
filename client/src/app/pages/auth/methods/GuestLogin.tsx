import { Button } from "@/app/components/ui/button";
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
} from "@/app/components/ui/alert-dialog";
import { Input } from "@/app/components/ui/input";
import { useState } from "react";
import Loading from "react-loading";
import { useNavigate } from "react-router-dom";
import { UserAuthHandler } from "@/handlers/auth-handlers";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const GuestLogin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (name.length < 3 || name.length > 20) {
      toast.error("Name must be between 3 and 20 characters");
      return;
    }
    setIsSubmitting(true);
    await UserAuthHandler.createGuestUser(name)
      .then((res) => {
        queryClient.setQueryData(["currentUser"], res);
        navigate("/feed");
      })
      .catch((err) => {
        toast.error(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
