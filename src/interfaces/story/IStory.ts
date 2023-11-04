import { Types } from "mongoose";

export interface IStory {
  _id: Types.ObjectId;
  protagonist: string;
  city: string;
  story: string;
  images: string[];
  avatar: string;
  isApproved: boolean;
  isHighlighted: boolean;
  dateOfBirth?: Date;
  job?: string;
}

export interface RegisteringStory {
  protagonist: string;
  city: string;
  story: string;
  images: string[];
  isApproved?: boolean;
  isHighlighted?: boolean;
  dateOfBirth?: Date;
  avatar?: string;
  job?: string;
}
