import { IPostContent } from "@/types/post-types";
import SingleImage from "./single-image";

const Grid32 = ({
  images,
  setContents,
}: {
  images: string[];
  setContents?: React.Dispatch<React.SetStateAction<IPostContent>>;
}) => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2  max-h-[250px]  sm:max-h-[400px]">
      <SingleImage image={images[0]} setContents={setContents} />
      <SingleImage image={images[1]} setContents={setContents} />
      <SingleImage
        image={images[2]}
        setContents={setContents}
        className="col-span-2"
      />
    </div>
  );
};
export default Grid32;
