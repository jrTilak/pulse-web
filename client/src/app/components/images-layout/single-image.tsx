import { IPostContent } from "@/types/post-types";
import { cn } from "../../../lib/utils";
import RemoveButton from "./remove-button";

const SingleImage = ({
  image,
  className,
  setContents,
}: {
  image: string;
  className?: string;
  setContents?: React.Dispatch<React.SetStateAction<IPostContent>>;
}) => {
  return (
    <div className={cn("relative w-full h-full max-h-[300px]", className)}>
      <img
        className="object-cover object-center w-full h-full rounded-lg "
        src={image}
      />
      {setContents && <RemoveButton image={image} setContents={setContents} />}
    </div>
  );
};

export default SingleImage;
