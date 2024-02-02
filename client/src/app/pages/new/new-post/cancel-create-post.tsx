import React from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/app/components/ui/button";
import { IPostContent } from "@/types/post-types";

const CancelCreatePost = ({
  setContents,
}: {
  setContents: React.Dispatch<React.SetStateAction<IPostContent>>;
}) => {
  const navigate = useNavigate();
  const handlePostCancel = () => {
    setContents({} as IPostContent);
    navigate("/feed");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="" variant="destructive">
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will discard your post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handlePostCancel}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default CancelCreatePost;
