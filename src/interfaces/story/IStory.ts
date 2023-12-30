import { Types } from "mongoose";

export interface StoryTranslatedFields {
  protagonist: string;
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
  city: string;
  age: number | null;
  shares: {
    [key: string]: number;
  };
  tags: string[];
  viewsCount: number;
  translations: {
    [key: string]: StoryTranslatedFields;
  };
  isApproved: boolean;
  isHighlighted: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RegisteringStory = StoryTranslatedFields & {
  city: string;
  avatar?: Image;
  age?: number;
  tags?: string[];
  translations: {
    [key: string]: StoryTranslatedFields;
  };
};
