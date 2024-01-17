import { PostContentType } from "@/validators/post.validators";
import SingleImage from "./single-image";

const VerticalLayout = ({
  images,
  setContents,
}: {
  images: string[];
  setContents?: React.Dispatch<
    React.SetStateAction<PostContentType["content"]>
  >;
}) => {
  return (
    <div
      className={`grid grid-cols-${images.length} gap-2  max-h-[250px]  sm:max-h-[400px]`}
    >
      {images.map((image, index) => (
        <SingleImage image={image} key={index} setContents={setContents} />
      ))}
    </div>
  );
};

export default VerticalLayout;
