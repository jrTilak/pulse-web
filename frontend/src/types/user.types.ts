import { SupportedSocialLinksType } from "@/components/shared/badges/social-link-badge";

export interface UserType {
  _id: string;
  username: string;
  name: string;
  profileImg: string;
  coverImg: string;
  bio: string;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
  lastSeen: string;
  followers: number;
  following: number;
  likes: number;
  pinnedPosts: string[];
  posts: string[];
  socialLinks: {
    label: SupportedSocialLinksType;
    name: string;
    url: string;
  }[];
  stories: string[];
  __v: number;
}
