import { Types } from "mongoose";

export interface StoryTranslatedFields {
  protagonist: string;
  city: string;
  story: string;
  job?: string;
}

export interface Image {
  cloudinaryId: string;
  url: string;
}

export type IStory = StoryTranslatedFields & {
  _id: Types.ObjectId;
  avatar: Image;
  isApproved: boolean;
  isHighlighted: boolean;
  isDeleted: boolean;
  age: number | null;
  shares: {
    [key: string]: number;
  };
  tags: string[];
  viewsCount: number;
  translations: {
    [key: string]: StoryTranslatedFields;
  };
  createdAt: string;
  updatedAt: string;
};

export type RegisteringStory = StoryTranslatedFields & {
  avatar?: Image;
  age?: number;
  tags?: string[];
  translations: {
    [key: string]: StoryTranslatedFields;
  };
};
