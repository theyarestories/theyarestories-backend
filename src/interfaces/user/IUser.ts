import { Types } from "mongoose";

export enum UserRole {
  user = "user",
  publisher = "publisher",
  admin = "admin",
}

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: string;
}

export interface RegisteringUser {
  mixpanelId: string;
  username: string;
  email: string;
  password: string;
}
