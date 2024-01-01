import { Types } from "mongoose";

export interface StoryTranslatedFields {
  _id: Types.ObjectId;
  protagonist: string;
  story: string;
  job?: string;
  isApproved: boolean;
}

export interface Image {
  cloudinaryId: string;
  url: string;
}

export type IStory = {
  _id: Types.ObjectId;
  protagonist: string;
  story: string;
  job?: string;
  avatar: Image;
  city: string;
  age: number | null;
  shares: {
    [key: string]: number;
  };
  tags: string[];
  viewsCount: number;
  translationId: Types.ObjectId;
  translations: {
    [key: string]: StoryTranslatedFields;
  };
  isApproved: boolean;
  isHighlighted: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RegisteringTranslatedFields = {
  _id?: Types.ObjectId;
  protagonist: string;
  story: string;
  job?: string;
};

export type RegisteringStory = {
  protagonist: string;
  story: string;
  job?: string;
  city: string;
  avatar?: Image;
  age?: number;
  tags?: string[];
  translationId: Types.ObjectId;
  translations: {
    [key: string]: RegisteringTranslatedFields;
  };
};
