export interface IUser {
  _id: string;
  name: string;
  username: string;
  profileImg?: string;
  coverImg?: string;
  createdAt: string;
  updatedAt: string;
  lastSeen: string;
  isOnline: boolean;
  followers: number;
  following: number;
  likes: number;
  stories: string[];
  pinnedPosts: string[];
  posts: string[];
  socialLinks: ISocialLink[];
}

export interface ISocialLink {
  label: string;
  name: string;
  url: string;
}
