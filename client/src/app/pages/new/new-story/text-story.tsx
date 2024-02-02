import { shadow } from "@/assets/constants/styles";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { useNavigate } from "react-router-dom";
import { VscSend } from "react-icons/vsc";
import Loading from "react-loading";
import { MdFormatBold } from "react-icons/md";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import { BsTypeItalic } from "react-icons/bs";
import { GrUnderline } from "react-icons/gr";
import { FiPlus, FiMinus } from "react-icons/fi";
import StoryHandler from "@/handlers/story-handlers";
import { IUserStory } from "@/types/story-types";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

const TextStory = () => {
  const [storyText, setStoryText] = useState("Add text here");
  const [storyConfig, setStoryConfig] = useState<IUserStory["storyConfig"]>({
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

  const handleSubmit = useMutation({
    mutationFn: () =>
      StoryHandler.createNewStory("text", storyText, storyConfig),
    onSuccess: () => {
      navigate("/feed");
      toast.success("Story Posted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

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
            suppressContentEditableWarning
            contentEditable={true}
            onInput={(e) => {
              setStoryText(e.currentTarget.textContent || "");
              //move cursor to end
              const selection = window.getSelection();
              if (selection) {
                const range = document.createRange();
                range.selectNodeContents(e.currentTarget);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }}
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
          disabled={
            handleSubmit.isPending ||
            storyText.trim().toLowerCase() === "add text here" ||
            !storyText ||
            storyText.trim().length === 0
          }
          onClick={() => handleSubmit.mutate()}
          className="min-w-[60%] flex text-center justify-center gap-4"
        >
          {handleSubmit.isPending ? (
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
