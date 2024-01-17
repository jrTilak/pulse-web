import { cn } from "@/lib/utils";
import { PostContentType } from "@/validators/post.validators";
import { CiGrid2V, CiGrid31, CiGrid32 } from "react-icons/ci";

const ImagesLayoutButtons = ({
  images,
  layout,
  setContents,
}: {
  images: string[];
  layout: PostContentType["content"]["imagesLayout"];
  setContents: React.Dispatch<
    React.SetStateAction<PostContentType["content"]>
  >;
}) => {
  const buttons = [
    {
      icon: CiGrid2V,
      layout: "vertical",
    },
    {
      icon: CiGrid31,
      layout: "grid31",
    },
    {
      icon: CiGrid32,
      layout: "grid32",
    },
  ];

  if (images.length !== 3) return null;
  return (
    <div className="flex items-center gap-2">
      {buttons.map((button) => (
        <button
          key={button.layout}
          onClick={() => 
            setContents((prev) => ({
              ...prev,
              imagesLayout: button.layout as PostContentType["content"]["imagesLayout"],
            }))
          }
          className={cn(
            "p-2 rounded-full hover:bg-gray-200",
            layout === button.layout ? "bg-gray-100" : ""
          )}
        >
          <button.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};
export default ImagesLayoutButtons;
