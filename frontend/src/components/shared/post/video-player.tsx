import { IoIosClose } from "react-icons/io";
import { FaPause, FaPlay } from "react-icons/fa6";
import { MdVolumeUp, MdVolumeOff } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { cn } from "../../../lib/utils";
import { PostContentType } from "@/validators/post.validators";
import { shadow } from "@/assets/constants/styles";
import { AiOutlineFullscreen } from "react-icons/ai";

const VideoPlayer = ({
  video,
  setContents,
}: {
  video: string;
  setContents?: React.Dispatch<
    React.SetStateAction<PostContentType["content"]>
  >;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoControlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("ended", handleVideoEnd); // Add event listener for video end
    }
    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoElement.removeEventListener("ended", handleVideoEnd); // Remove event listener for video end
      }
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isPlaying) {
        videoElement.play();
        videoControlsRef.current?.classList.add("opacity-0");
      } else {
        videoElement.pause();
        videoControlsRef.current?.classList.remove("opacity-0");
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleMuteUnmute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleTimeUpdate = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setDuration(videoElement.duration);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false); // Set isPlaying to false when video ends
  };

  const handleFullScreen = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.requestFullscreen();
    }
  };

  return (
    <div
      className="relative max-h-[250px] sm:max-h-[400px] w-full group overflow-hidden rounded-md bg-muted"
      style={{
        boxShadow:
          "inset 14.11px 14.11px 23px #D1D2D4, inset -14.11px -14.11px 23px #FFFFFF",
      }}
    >
      <video
        ref={videoRef}
        className="!object-contain w-full h-full rounded-lg max-h-[250px] sm:max-h-[400px]"
        src={video}
        muted={isMuted}
        controls={false}
        loop={true}
      />

      <div
        ref={videoControlsRef}
        className={cn(
          "md:opacity-0 group-hover:opacity-100 border-t border-foreground transition-all absolute w-full bottom-0 left-0 right-0 flex gap-2 justify-between items-center p-2 text-background",
          shadow.md
        )}
        style={{
          opacity: !isPlaying ? "1" : "",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <button onClick={handlePlayPause} className="">
          {isPlaying ? (
            <FaPause className="w-4 h-4" />
          ) : (
            <FaPlay className="w-4 h-4" />
          )}
        </button>
        <span>{`${Math.floor(currentTime / 60)}:${Math.floor(
          currentTime % 60
        )}/${Math.floor(duration / 60)}:${Math.floor(duration % 60)}`}</span>
        <div>
          <button onClick={handleMuteUnmute} className="">
            {isMuted ? (
              <MdVolumeOff className="w-4 h-4" />
            ) : (
              <MdVolumeUp className="w-4 h-4" />
            )}
          </button>
          <button onClick={handleFullScreen} className="ml-2">
            <AiOutlineFullscreen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {setContents && (
        <button
          onClick={() => {
            setContents && setContents((prev) => ({ ...prev, video: "" }));
          }}
          className="absolute top-1 right-1 p-0.5 rounded-full bg-primary"
        >
          <IoIosClose className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
