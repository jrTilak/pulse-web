import { shadow } from "@/assets/constants/styles";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { VscSend } from "react-icons/vsc";
import { toast } from "@/hooks/use-toast";
import Loading from "react-loading";
import { useAuthContext } from "@/hooks/use-auth";
import UserHandler from "@/handlers/user-handlers";
const TextStory = () => {
  const { setCurrentUser } = useAuthContext();
  const [storyText, setStoryText] = useState("Add text here");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const storyTextBoxRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();

  const handleStoryBoxClick = () => {
    if (storyTextBoxRef.current) {
      storyTextBoxRef.current.focus();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const storyText = storyTextBoxRef.current?.innerText || "";
    if (
      storyText.trim().length === 0 ||
      storyText.toLowerCase() === "add text here"
    ) {
      toast({
        title: "Error",
        description: "Invalid story text",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    const res = await UserHandler.createNewStory("text", storyText);
    setIsSubmitting(false);
    if (!res.success) {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Story posted successfully",
    });
    setCurrentUser((prev) => ({
      ...prev,
      stories: [...prev.stories, res.data._id],
    }));
    setStoryText("Add text here");
    navigate("/feed");
  };

  return (
    <div className="flex gap-4 flex-col">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "w-full bg-muted rounded-md flex items-center justify-center flex-col cursor-pointer aspect-[3/5] p-4",
          shadow.sm
        )}
      >
        <p
          onClick={handleStoryBoxClick}
          contentEditable={true}
          ref={storyTextBoxRef}
          className="text-lg font-semibold text-wrap overflow-hidden text-center break-words w-full p-2"
        >
          {storyText}
        </p>
      </motion.div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setStoryText("Add text here");
            navigate("/feed");
          }}
        >
          Discard
        </Button>
        <Button
          onClick={handleSubmit}
          className="min-w-[60%] flex text-center justify-center gap-4"
        >
          {isSubmitting ? (
            <>
              <span>Posting</span>
              <Loading type="spin" color="white" height={20} width={20} />
            </>
          ) : (
            <>
              <span>Post</span>
              <VscSend className="text-lg" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
export default TextStory;
