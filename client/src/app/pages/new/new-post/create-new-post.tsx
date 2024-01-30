import { FaPencilAlt } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { PiMicrophone } from "react-icons/pi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { cn } from "../../../../lib/utils";
import { useEffect, useRef, useState } from "react";
import CancelCreatePost from "./cancel-create-post";
import ReactLoading from "react-loading";
import { motion } from "framer-motion";
import { shadow } from "@/assets/constants/styles";
import { IPostContent } from "@/types/post-types";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import ImagesLayoutButtons from "./images-layout-button";
import ImagesPost from "@/app/components/post/image-post";
import VideoPlayer from "@/app/components/post/video-player";
import AudioPlayer from "@/app/components/post/audio-player";
import { Button } from "@/app/components/ui/button";
import toast from "react-hot-toast";
import PostValidator from "@/validators/post-validators";
import PostHandler from "@/handlers/post-handlers";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/types/user-types";

const CreateNewPost = () => {
  const { data: currentUser } = useQuery<IUser, string>({
    queryKey: ["currentUser"],
  });
  const [contents, setContents] = useState<IPostContent>();
  const [isPostUploading, setIsPostUploading] = useState(false);
  const [isDraftUploading, setIsDraftUploading] = useState(false);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const createPost = async (isDraft: boolean = false) => {
    if (!contents?.text) {
      textInputRef.current?.focus();
      return toast.error("Please write something.");
    }
    const data = PostValidator.validatePostContent({ content: contents });
    if (!data.success) {
      return toast.error("Please write something.");
    }
    isDraft ? setIsDraftUploading(true) : setIsPostUploading(true);
    const toRun = isDraft
      ? PostHandler.createADraft
      : PostHandler.createANewPost;

    toRun(data.data as any)
      .then(() => {
        toast.success(`${isDraft ? "Draft" : "Post"} created successfully.`);
        navigate(`/u/${currentUser?.username}`);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        isDraft ? setIsDraftUploading(false) : setIsPostUploading(false);
      });
  };

  useEffect(() => {
    if (contents?.images && contents?.images.length < 3) {
      setContents((prev) => ({ ...prev, imagesLayout: "vertical" } as any));
    }
  }, [contents?.images?.length]);

  const handleImageVideoUpload = () => {
    if (
      (contents?.images && contents?.images.length >= 3) ||
      (contents?.video && contents?.video.length > 0)
    )
      return toast.error("You can only upload 3 images or 1 video.");
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      contents?.images && contents?.images.length > 0
        ? "image/*"
        : "image/*,video/*";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        if (file.type.startsWith("image/")) handleImageChange(file);
        else if (file.type.startsWith("video/")) handleVideoChange(file);
        else {
          toast.error("Invalid file type.");
          return;
        }
      }
    };
    input.click();
  };
  const handleImageChange = (file: File) => {
    if (file) {
      // Check the file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type.");
        return;
      }

      // Check the file size
      const fileSizeInMB = file.size / (1024 * 1024);
      const maxSizeInMB = 5;
      if (fileSizeInMB > maxSizeInMB) {
        toast.error(`The image size should be less than ${maxSizeInMB} MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setContents(
          (prev) =>
            ({
              ...prev,
              images: [...(prev?.images || []), base64Data],
            } as any)
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (file: File) => {
    if (file) {
      // Check the file type
      if (!file.type.startsWith("video/")) {
        toast.error("Invalid file type.");
        return;
      }

      // Check the file size
      const fileSizeInMB = file.size / (1024 * 1024);
      const maxSizeInMB = 8;
      if (fileSizeInMB > maxSizeInMB) {
        toast.error(`The video size should be less than ${maxSizeInMB} MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setContents((prev) => ({ ...prev, video: base64Data } as any));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        if (file.type.startsWith("audio/")) {
          // Check the file size
          const fileSizeInMB = file.size / (1024 * 1024);
          const maxSizeInMB = 5;
          if (fileSizeInMB > maxSizeInMB) {
            toast.error("The audio size should be less than 5 MB.");
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result as string;
            setContents((prev) => ({ ...prev, audio: base64Data } as any));
          };
          reader.readAsDataURL(file);
        } else {
          toast.error("Invalid file type.");
          return;
        }
      }
    };
    input.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center h-screen mt-12"
    >
      <div
        className={cn(
          "p-6 flex justify-evenly flex-col rounded-md max-w-[600px] max-h-full w-full m-6",
          shadow.sm
        )}
      >
        <Card className="mb-6 border-none rounded-lg">
          <CardHeader className="flex items-baseline p-2 space-x-2 border-b-2">
            <FaPencilAlt className="w-6 h-6 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">
              Create Post
            </h2>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="grid w-full items-center gap-1.5">
              <div className="relative">
                <Textarea
                  className="w-full h-12 min-h-0 p-2 border-none rounded-md outline-none"
                  id="text"
                  autoFocus
                  ref={textInputRef}
                  placeholder="What's on your mind?"
                  value={contents?.text}
                  onChange={(e) => {
                    let textVal = e.target.value;
                    if (textVal.length > 600) {
                      textVal = textVal.slice(0, 600);
                    }
                    setContents(
                      (prev) => ({ ...prev, text: textVal } as IPostContent)
                    );
                  }}
                />
                <span className="absolute text-xs font-light bottom-1 right-1">
                  {contents?.text?.length || 0} / 600
                </span>
              </div>
              {contents?.images && contents?.images.length > 0 && (
                <>
                  <ImagesLayoutButtons
                    images={contents.images}
                    layout={contents.imagesLayout}
                    setContents={setContents as any}
                  />
                  <ImagesPost
                    images={contents.images}
                    key="editing"
                    setContents={setContents as any}
                    layout={contents.imagesLayout}
                  />
                </>
              )}
              {contents?.video && (
                <VideoPlayer
                  video={contents.video}
                  setContents={setContents as any}
                />
              )}
              {contents?.audio && (
                <AudioPlayer
                  audio={contents.audio}
                  setContents={setContents as any}
                />
              )}
              <div className="flex justify-start gap-2 mt-2">
                <Button
                  variant="secondary"
                  className="flex items-center "
                  onClick={handleImageVideoUpload}
                >
                  <CiImageOn className="w-4 h-4" />
                  <span>
                    {contents?.images && contents?.images?.length > 0
                      ? "Photo"
                      : "Photo/Video"}
                  </span>
                </Button>
                <Button
                  onClick={handleAudioUpload}
                  variant="secondary"
                  className="flex items-center "
                >
                  <PiMicrophone className="w-4 h-4" />
                  <span>Audio</span>
                </Button>
                <Button variant="secondary" className="flex items-center ">
                  <IoDocumentTextOutline className="w-4 h-4" />
                  <span>Document</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between">
          <CancelCreatePost setContents={setContents as any} />
          <div className="flex space-x-2">
            <Button
              className=""
              variant="ghost"
              onClick={() => createPost(true)}
            >
              {isDraftUploading ? (
                <ReactLoading
                  type="spin"
                  color="black"
                  height={20}
                  width={20}
                />
              ) : (
                "Save Draft"
              )}
            </Button>
            <Button
              onClick={() => createPost(false)}
              className="min-w-[80px]"
              variant="default"
            >
              {isPostUploading ? (
                <ReactLoading type="spin" color="#fff" height={20} width={20} />
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default CreateNewPost;
