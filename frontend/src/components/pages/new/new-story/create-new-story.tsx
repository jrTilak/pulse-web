import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdOutlineTextFormat } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { MdOutlineImage } from "react-icons/md";
import { motion } from "framer-motion";
import TextStory from "./text-story";
import ImageStory from "./image-story";
import VideoStory from "./video-story";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const CreateNewStory = () => {
  const availableStoryTypes = ["text", "image", "video"];
  const navigate = useNavigate();
  const { type } = useParams();
  const [storyType, setStoryType] = useState("image");

  useEffect(() => {
    if (type && availableStoryTypes.includes(type)) {
      setStoryType(type);
    } else {
      setStoryType("image");
    }
  }, [type]);

  return (
    <motion.div
      layout
      className="flex w-full h-full flex-col justify-center items-center"
    >
      <Tabs
        value={storyType}
        defaultValue="image"
        className=""
        onValueChange={(value) => navigate(`/new/story/${value}`)}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="text">
            <span className="flex gap-2">
              <MdOutlineTextFormat className="text-2xl" />
              <span className="">Text</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="image">
            <span className="flex gap-2">
              <MdOutlineImage className="text-2xl" />
              <span className="">Image</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="video">
            <span className="flex gap-2">
              <IoVideocamOutline className="text-2xl" />
              <span className="">Video</span>
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <TextStory />
        </TabsContent>
        <TabsContent value="image">
          <ImageStory />
        </TabsContent>
        <TabsContent value="video">
          <VideoStory />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
export default CreateNewStory;
