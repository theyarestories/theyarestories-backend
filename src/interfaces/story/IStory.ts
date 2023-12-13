import { Types } from "mongoose";

export interface StoryTranslatedFields {
  protagonist: string;
  city: string;
  story: string;
  job: string;
}

export type IStory = StoryTranslatedFields & {
  _id: Types.ObjectId;
  avatar?: string;
  images: string[];
  isApproved: boolean;
  isHighlighted: boolean;
  isDeleted: boolean;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
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
>;
