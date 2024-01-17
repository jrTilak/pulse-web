import { PostContentType } from "@/validators/post.validators";
import SingleImage from "./single-image";

const Grid31 = ({
  images,
  setContents,
}: {
  images: string[];
  setContents?: React.Dispatch<
    React.SetStateAction<PostContentType["content"]>
  >;
}) => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 max-h-[250px]  sm:max-h-[400px]">
      <SingleImage
        image={images[0]}
        setContents={setContents}
        className="col-span-2"
      />
      <SingleImage image={images[1]} setContents={setContents} />
      <SingleImage image={images[2]} setContents={setContents} />
    </div>
  );
};
export default Grid31;
