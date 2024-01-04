import { Types } from "mongoose";

export interface Image {
  cloudinaryId: string;
  url: string;
}

export interface StoryTranslatedFields {
  _id: Types.ObjectId;
  translationLanguage: string;
  fromLanguage: string;
  protagonist: string;
  story: string;
  job?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RegisteringTranslatedFields = {
  translationLanguage: string;
  fromLanguage: string;
  protagonist: string;
  story: string;
  job?: string;
};

export type IStory = {
  _id: Types.ObjectId;
  protagonist: string;
  protagonistTranslations: string[];
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
  translationLanguage: String; // ar
  translations: StoryTranslatedFields[];
  isApproved: boolean;
  isHighlighted: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RegisteringStory = {
  protagonist: string;
  protagonistTranslations: string[];
  story: string;
  job?: string;
  city: string;
  avatar?: Image;
  age?: number;
  tags?: string[];
  translationLanguage: String; // ar
  translations: RegisteringTranslatedFields[];
};
