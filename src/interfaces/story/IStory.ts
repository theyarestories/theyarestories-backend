import { Types } from "mongoose";

export interface IStory {
  _id: Types.ObjectId;
  protagonist: string;
  city: string;
  story: string;
  images: string[];
  isApproved: boolean;
  isHighlighted: boolean;
  isDeleted: boolean;
  dateOfBirth?: Date;
  job?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisteringStory {
  protagonist: string;
  city: string;
  story: string;
  images: string[];
  isApproved?: boolean;
  isHighlighted?: boolean;
  isDeleted?: boolean;
  dateOfBirth?: Date;
  job?: string;
}
