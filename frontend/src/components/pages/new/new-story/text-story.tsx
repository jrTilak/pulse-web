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
import { MdFormatBold } from "react-icons/md";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BsTypeItalic } from "react-icons/bs";
import { GrUnderline } from "react-icons/gr";
import { FiPlus, FiMinus } from "react-icons/fi";
import StoryHandler from "@/handlers/story-handlers";
import { StoryConfigType } from "@/types/story.types";

const TextStory = () => {
  const { setCurrentUser } = useAuthContext();
  const [storyText, setStoryText] = useState("Add text here");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storyConfig, setStoryConfig] = useState<StoryConfigType>({
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    fontSize: 16,
    textColor: "#000000",
    backgroundColor: "#ffffff",
  });
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
    const res = await StoryHandler.createNewStory(
      "text",
      storyText,
      storyConfig
    );
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

  const handleFontSizeChange = (isPlus: boolean, prevFontSize: number) => {
    if (prevFontSize < 10 || prevFontSize > 25) return;
    setStoryConfig((prev) => ({
      ...prev,
      fontSize: isPlus ? prevFontSize + 1 : prevFontSize - 1,
    }));
  };

  const handleToggleChange = (values: string[]) => {
    setStoryConfig((prev) => ({
      ...prev,
      isBold: values.includes("bold"),
      isItalic: values.includes("italic"),
      isUnderlined: values.includes("underline"),
    }));
  };

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex gap-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "min-w-full w-56 bg-muted rounded-md flex items-center justify-center flex-col cursor-pointer aspect-[3/5] p-4",
            shadow.sm
          )}
          style={{
            backgroundColor: storyConfig.backgroundColor,
          }}
        >
          <p
            onClick={handleStoryBoxClick}
            contentEditable={true}
            ref={storyTextBoxRef}
            className={cn(
              "text-wrap overflow-hidden text-center break-words w-full p-2"
            )}
            style={{
              fontSize: `${storyConfig.fontSize}px`,
              fontWeight: storyConfig.isBold ? "bold" : "normal",
              fontStyle: storyConfig.isItalic ? "italic" : "normal",
              textDecoration: storyConfig.isUnderlined ? "underline" : "none",
              color: storyConfig.textColor,
            }}
          >
            {storyText}
          </p>
        </motion.div>
        <ToggleGroup
          onValueChange={(values) => {
            handleToggleChange(values);
          }}
          type="multiple"
          className="flex flex-col"
        >
          <label
            title="Font color"
            htmlFor="font-color"
            className="w-5 h-5 rounded-full cursor-pointer border border-gray-400"
            style={{ backgroundColor: storyConfig.textColor }}
          >
            <input
              onChange={(e) => {
                setStoryConfig((prev) => ({
                  ...prev,
                  textColor: e.target.value,
                }));
              }}
              type="color"
              name="font-color"
              id="font-color"
              className="w-0 h-0 opacity-"
            />
          </label>

          <Button
            title="Increase font size"
            onClick={() => handleFontSizeChange(true, storyConfig.fontSize)}
            disabled={storyConfig.fontSize >= 25}
            variant="ghost"
            className="p-3"
          >
            <FiPlus className="h-4 w-4" />
          </Button>
          <Button
            title="Decrease font size"
            onClick={() => handleFontSizeChange(false, storyConfig.fontSize)}
            disabled={storyConfig.fontSize <= 10}
            variant="ghost"
            className="p-3"
          >
            <FiMinus className="h-4 w-4" />
          </Button>
          <ToggleGroupItem
            title="Toggle bold"
            value="bold"
            aria-label="Toggle bold"
          >
            <MdFormatBold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            title="Toggle italic"
            value="italic"
            aria-label="Toggle italic"
          >
            <BsTypeItalic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            title="Toggle underline"
            value="underline"
            aria-label="Toggle underline"
          >
            <GrUnderline className="h-4 w-4" />
          </ToggleGroupItem>
          <label
            title="Background color"
            htmlFor="bg-color"
            className="w-5 h-5 rounded-full cursor-pointer border border-gray-400"
            style={{ backgroundColor: storyConfig.backgroundColor }}
          >
            <input
              onChange={(e) => {
                setStoryConfig((prev) => ({
                  ...prev,
                  backgroundColor: e.target.value,
                }));
              }}
              type="color"
              name="bg-color"
              id="bg-color"
              className="w-0 h-0 opacity-0"
            />
          </label>
        </ToggleGroup>
      </div>
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
