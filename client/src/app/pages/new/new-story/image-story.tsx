import { shadow } from "@/assets/constants/styles";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { VscSend } from "react-icons/vsc";
import { MdOutlineCloudUpload } from "react-icons/md";
import Loading from "react-loading";
import StoryHandler from "@/handlers/story-handlers";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
const ImageStory = () => {
  const [storyImage, setStoryImage] = useState("");
  const navigate = useNavigate();

  const handleUSelectImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement)?.files?.[0];
      //check the file is image
      if (!file?.type.includes("image")) {
        toast.error("Please select an image");
        return;
      }
      //check the file size is less than 5mb
      if (file?.size > 5 * 1024 * 1024) {
        toast.error("Please select an image less than 5mb");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setStoryImage(reader.result as string);
      };
    };
    input.click();
  };

  const handleSubmit = useMutation({
    mutationFn: () => StoryHandler.createNewStory("image", storyImage),
    onSuccess: () => {
      navigate("/feed");
      toast.success("Story Posted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div className="flex relative gap-4 flex-col">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "min-w-full w-56 bg-muted rounded-md flex items-center justify-center flex-col cursor-pointer aspect-[3/5]",
          shadow.sm
        )}
      >
        {storyImage && (
          <img
            src={storyImage}
            alt="story"
            className=" object-cover object-center w-full h-full rounded-md"
          />
        )}
        <div
          onClick={handleUSelectImage}
          className="w-[90%] h-[40%] flex items-center justify-center absolute z-10 border-dashed border-2 border-muted-foreground rounded-md"
        >
          <button className="flex flex-col justify-center items-center">
            <MdOutlineCloudUpload className="text-3xl text-muted-foreground" />
            <p className="text-muted-foreground">
              {storyImage ? "Change Image" : "Upload Image"}
            </p>
          </button>
        </div>
      </motion.div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setStoryImage("Add Image here");
            navigate("/feed");
          }}
        >
          Discard
        </Button>
        <Button
          disabled={!storyImage || handleSubmit.isPending}
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
export default ImageStory;
