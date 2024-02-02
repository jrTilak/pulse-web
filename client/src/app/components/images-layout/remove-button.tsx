import { IPostContent } from "@/types/post-types";
import { IoIosClose } from "react-icons/io";

const RemoveButton = ({
  image,
  setContents,
}: {
  image: string;
  setContents: React.Dispatch<React.SetStateAction<IPostContent>>;
}) => {
  return (
    <button
      onClick={() => {
        setContents((prev) => ({
          ...prev,
          images: prev?.images?.filter((img) => img !== image) || [],
        }));
      }}
      className="absolute top-1 right-1 p-0.5 rounded-full bg-primary"
    >
      <IoIosClose className="w-4 h-4 text-white" />
    </button>
  );
};

export default RemoveButton;
