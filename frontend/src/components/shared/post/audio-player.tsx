import { cn } from "../../../lib/utils";
import { FaPlay, FaPause } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import usePathname from "../../../hooks/use-pathname";
import { PostContentType } from "@/validators/post.validators";
import { shadow } from "@/assets/constants/styles";

const AudioPlayer = ({
  audio,
  setContents,
}: {
  audio: string;
  setContents?: React.Dispatch<React.SetStateAction<PostContentType["content"]>>;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("loadedmetadata", () => {
        setTotalTime(Math.floor(audioElement.duration));
      });
      audioElement.addEventListener("timeupdate", () => {
        setCurrentTime(Math.floor(audioElement.currentTime));
      });
    }
  }, []);

  const handlePlayPause = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying((prev) => !prev);
    }
  };

  const convertSecToMinAndSec = (sec: number) => {
    const min = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${min} : ${seconds}`;
  };

  const handleAudioTimeChange = (value: string) => {
    const newTime = Math.floor((parseInt(value) / 100) * totalTime);
    setCurrentTime(newTime);
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.currentTime = newTime;
      if (!isPlaying) {
        handlePlayPause();
      }
    }
  };

  return (
    <div
      className={cn(
        "flex w-full relative justify-between items-center gap-4 rounded-lg p-4",
        shadow.md
      )}
    >
      <button
        onClick={handlePlayPause}
        className={cn(
          "h-10 w-10 p-4 rounded-full flex items-center",
          shadow.lg
        )}
      >
        {isPlaying ? (
          <FaPause className="w-6 h-6 cursor-pointer text-primary" />
        ) : (
          <FaPlay className="w-6 h-6 cursor-pointer text-primary" />
        )}
      </button>
      <audio ref={audioRef} src={audio} />
      <input
        type="range"
        className="w-full transition-all bg-primary"
        min={0}
        max={Math.floor(totalTime)}
        value={Math.floor(currentTime)}
        onChange={(e) => handleAudioTimeChange(e.target.value)}
      />
      <div className="flex gap-2 font-medium tracking-wide min-w-max amplitude-current-time ">
        <span className="text-primary">
          {convertSecToMinAndSec(currentTime)}
        </span>
        <span className="text-muted-foreground">
          {" / "}
          {convertSecToMinAndSec(totalTime)}
        </span>
      </div>
      {pathname === "/new/post/" && (
        <button
          onClick={() => {
            setContents && setContents((prev) => ({ ...prev, audio: "" }));
          }}
          className="absolute top-1 right-1 p-0.5 rounded-full bg-primary"
        >
          <IoIosClose className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
};

export default AudioPlayer;
