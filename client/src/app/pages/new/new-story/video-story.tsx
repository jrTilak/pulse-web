import { shadow } from "@/assets/constants/styles";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { VscSend } from "react-icons/vsc";
import { MdOutlineCloudUpload } from "react-icons/md";
import { TiMediaPlay } from "react-icons/ti";
import { TiMediaPause } from "react-icons/ti";
import { TbVolume, TbVolume3 } from "react-icons/tb";
import Loading from "react-loading";
import StoryHandler from "@/handlers/story-handlers";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
const VideoStory = () => {
  const [storyVideo, setStoryVideo] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const handleUSelectVideo = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "Video/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement)?.files?.[0];
      //check the file is Video
      if (!file?.type.includes("video")) {
        toast.error("Please select a Video");
        return;
      }
      //check the file size is less than 5mb
      if (file?.size > 5 * 1024 * 1024) {
        toast.error("Please select a Video less than 5mb");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setStoryVideo(reader.result as string);
      };
    };
    input.click();
  };

  const handleSubmit = useMutation({
    mutationFn: () => StoryHandler.createNewStory("video", storyVideo),
    onSuccess: () => {
      navigate("/feed");
      toast.success("Story Posted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleMuteToggle = (setMute: boolean) => {
    setIsMuted(setMute);
  };
  const handlePlayToggle = (setPlay: boolean) => {
    setIsPlaying(setPlay);
    if (setPlay) {
      videoPlayerRef.current?.play();
    } else {
      videoPlayerRef.current?.pause();
    }
  };

  return (
    <div className="flex relative gap-4 flex-col">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "min-w-full w-56 bg-muted rounded-md flex items-center justify-center flex-col aspect-[3/5]",
          shadow.sm
        )}
      >
        {storyVideo && (
          <div className="relative w-full h-full rounded-md overflow-hidden flex items-center justify-center">
            <video
              ref={videoPlayerRef}
              src={storyVideo}
              className=" object-contain object-center"
              controls={false}
              autoPlay={true}
              loop={true}
              muted={isMuted}
              playsInline={true}
              onPlay={() => handlePlayToggle(true)}
              onPause={() => handlePlayToggle(false)}
            />
            <div className="controls flex top-2 right-2 absolute z-50">
              {isPlaying ? (
                <button
                  onClick={() => handlePlayToggle(false)}
                  className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
                >
                  <TiMediaPause className="text-3xl" />
                </button>
              ) : (
                <button
                  onClick={() => handlePlayToggle(true)}
                  className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
                >
                  <TiMediaPlay className="text-3xl" />
                </button>
              )}
              {isMuted ? (
                <button
                  onClick={() => handleMuteToggle(false)}
                  className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
                >
                  <TbVolume3 className="text-2xl" />
                </button>
              ) : (
                <button
                  onClick={() => handleMuteToggle(true)}
                  className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
                >
                  <TbVolume className="text-2xl" />
                </button>
              )}
            </div>
          </div>
        )}
        <div
          onClick={handleUSelectVideo}
          className="w-[90%] h-[40%] flex items-center justify-center absolute z-10 border-dashed border-2 border-muted-foreground rounded-md"
        >
          <button className="flex flex-col justify-center items-center">
            <MdOutlineCloudUpload className="text-3xl text-muted-foreground" />
            <p className="text-muted-foreground">
              {storyVideo ? "Change Video" : "Upload Video"}
            </p>
          </button>
        </div>
      </motion.div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setStoryVideo("Add video here");
            navigate("/feed");
          }}
        >
          Discard
        </Button>
        <Button
          disabled={handleSubmit.isPending || !storyVideo}
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
export default VideoStory;
