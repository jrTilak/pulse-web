export interface UserStoryType {
  _id: string;
  createdBy: string;
  type: string;
  content: string;
  likes: string[];
  views: string[];
  createdAt: string;
  storyConfig?: StoryConfigType;
}

export interface StoryConfigType {
  isBold: boolean;
  isItalic: boolean;
  isUnderlined: boolean;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
}
