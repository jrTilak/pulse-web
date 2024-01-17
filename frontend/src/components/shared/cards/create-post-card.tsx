import { useNavigate } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { motion } from "framer-motion";
import { shadow } from "@/assets/constants/styles";
import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import { useAuthContext } from "@/hooks/use-auth";

const createPostCardButtons = [
  {
    label: "Status",
    icon: "https://www.svgrepo.com/show/228751/text-lines-writer.svg",
    classNames: "hidden sm:flex",
  },
  {
    label: "Image",
    icon: "https://www.svgrepo.com/show/474360/photo-album.svg",
  },
  {
    label: "Video",
    icon: "https://www.svgrepo.com/show/229042/video-camera.svg",
  },
  {
    label: "Document",
    icon: "https://www.svgrepo.com/show/316650/duotone-document-minus.svg",
  },
];

const CreatePostCard = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  return (
    <motion.div
      className={cn("rounded-md  flex flex-col p-3 px-4 shadow", shadow.sm)}
    >
      <div className="flex items-center pb-3 mb-2 space-x-2 border-b">
        <div className="w-10 h-10">
          <img
            src={currentUser?.profileImg || AVATAR_PLACEHOLDER}
            className="min-w-6 min-h-6 rounded-full aspect-square"
            alt="dp"
          />
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/new/post/");
          }}
          className="w-full h-10 pl-5 rounded-full cursor-pointer bg-muted hover:text-muted-foreground"
        >
          <span className="self-start">
            What&apos;s up {currentUser.name.split(" ")[0]}?
          </span>
        </Button>
      </div>
      <div className="flex w-full gap-4 text-sm font-thin text-muted-foreground">
        {createPostCardButtons.map((btn, index) => (
          <CreatePostCardButton {...btn} key={index} />
        ))}
      </div>
    </motion.div>
  );
};
export default CreatePostCard;

const CreatePostCardButton = ({
  label,
  icon,
  classNames,
}: (typeof createPostCardButtons)[0]) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      onClick={() => {
        navigate("/new/post/");
      }}
      className={cn("w-full gap-2", classNames)}
    >
      <img src={icon} className="w-6 h-6" />
      <p className="font-semibold">{label}</p>
    </Button>
  );
};
