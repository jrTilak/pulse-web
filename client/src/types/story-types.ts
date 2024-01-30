export interface IUserStory {
  _id: string;
  createdBy: string;
  type: string;
  content: string;
  likes: string[];
  views: string[];
  createdAt: string;
  storyConfig: {
    isBold: boolean;
    isItalic: boolean;
    isUnderlined: boolean;
    fontSize: number;
    textColor: string;
    backgroundColor: string;
  };
}
