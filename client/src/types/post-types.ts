import { IUser } from "./user-types";

export interface IPost {
  _id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  content: IPostContent;
  likes: string[];
  comments: IPostComment[];
  isPinned: boolean;
  owner: IUser;
}

export interface IPostContent {
  text: string;
  images: string[];
  video: string;
  audio: string;
  imagesLayout: string;
}

export interface IPostComment {
  _id: string;
  createdBy: string;
  createdAt: string;
  content: string;
}
