import { Types } from "mongoose";

export interface IStory {
  _id: Types.ObjectId;
  protagonist: string;
  city: string;
  story: string;
  images: string[];
  avatar: string;
  dateOfBirth?: Date;
  job?: string;
}

export interface RegisteringStory {
  protagonist: string;
  city: string;
  story: string;
  images: string[];
  dateOfBirth?: Date;
  avatar?: string;
  job?: string;
}
