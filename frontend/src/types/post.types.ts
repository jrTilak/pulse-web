import { CommentType } from "@/validators/post.validators";
import { UserType } from "./user.types";

export interface PostType {
  _id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  comments: CommentType[];
  isPinned: boolean;
  owner: UserType;
  content: {
    text: string;
    images: string[];
    video: string;
    audio: string;
    imagesLayout:  "vertical" | "grid31" | "grid32";
  };
}