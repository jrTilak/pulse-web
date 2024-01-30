import SimpleTextIconCard from "@/app/components/cards/simple-text-icon-card";
import { IoIosTimer } from "react-icons/io";
import { MdOutlineImage } from "react-icons/md";
const CreateNew = () => {
  return (
    <div className="flex gap-4 w-full h-full justify-center items-center">
      <SimpleTextIconCard Icon={IoIosTimer} text="Story" href="/new/story" />
      <SimpleTextIconCard Icon={MdOutlineImage} text="Post" href="/new/post" />
    </div>
  );
};
export default CreateNew;
