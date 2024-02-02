import { IPostContent } from "@/types/post-types";
import SingleImage from "../images-layout/single-image";
import VerticalLayout from "../images-layout/vertical-layout";
import Grid31 from "../images-layout/grid-31";
import Grid32 from "../images-layout/grid-32";

interface ImagesPostProps {
  images: string[];
  layout: string;
  setContents?: React.Dispatch<React.SetStateAction<IPostContent>>;
  isLoading?: boolean;
}

const ImagesPost = ({
  images,
  layout,
  setContents,
}: ImagesPostProps) => {
  if (images.length === 1) {
    return <SingleImage image={images[0]} setContents={setContents} />;
  } else {
    switch (layout) {
      case "vertical":
        return <VerticalLayout images={images} setContents={setContents} />;
      case "grid31":
        return <Grid31 images={images} setContents={setContents} />;
      case "grid32":
        return <Grid32 images={images} setContents={setContents} />;

      default:
        return <VerticalLayout images={images} setContents={setContents} />;
    }
  }
};
export default ImagesPost;
