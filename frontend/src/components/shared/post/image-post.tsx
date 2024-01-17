import { PostContentType } from "@/validators/post.validators";
import SingleImage from "../images-layouts/single-image";
import VerticalLayout from "../images-layouts/vertical-layout";
import Grid31 from "../images-layouts/grid-31";
import Grid32 from "../images-layouts/grid-32";

interface ImagesPostProps {
  images: string[];
  layout: PostContentType["content"]["imagesLayout"];
  setContents?: React.Dispatch<
    React.SetStateAction<PostContentType["content"]>
  >;
}

const ImagesPost = ({ images, layout, setContents }: ImagesPostProps) => {
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
