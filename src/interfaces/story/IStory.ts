import { Types } from "mongoose";

export interface StoryTranslatedFields {
  protagonist: string;
  city: string;
  story: string;
  job: string;
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
  createdAt: string;
  updatedAt: string;
  shares: {
    [key: string]: number;
  };
  translations: {
    [key: string]: StoryTranslatedFields;
  };
};

export type RegisteringStory = Omit<
  IStory,
  | "_id"
  | "isApproved"
  | "isHighlighted"
  | "isDeleted"
  | "createdAt"
  | "updatedAt"
  | "shares"
>;
