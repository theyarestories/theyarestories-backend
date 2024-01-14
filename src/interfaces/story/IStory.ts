import { Types } from "mongoose";

export interface Image {
  cloudinaryId: string;
  url: string;
}

export interface ITranslation {
  _id: Types.ObjectId;
  translationLanguage: string;
  fromLanguage: string;
  protagonist: string;
  story: string;
  job?: string;
  isApproved: boolean;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export type RegisteringTranslation = {
  translationLanguage: string;
  fromLanguage: string;
  protagonist: string;
  story: string;
  job?: string;
  isApproved?: boolean;
  approvedBy?: string;
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
  translations: ITranslation[];
  isApproved: boolean;
  approvedBy: string | null;
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
  isApproved?: boolean;
  approvedBy?: string;
  translationLanguage: String; // ar
  translations: RegisteringTranslation[];
};
