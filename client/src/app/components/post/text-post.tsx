import { Skeleton } from "../ui/skeleton";

const TextPost = ({
  content,
  isLoading,
}: {
  content: string;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <Skeleton className="h-10 w-3/4" />;
  }
  return (
    <p className="ml-4" style={{ wordWrap: "break-word" }}>
      {content}
    </p>
  );
};

export default TextPost;
