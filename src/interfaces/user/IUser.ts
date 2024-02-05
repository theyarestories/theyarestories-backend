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
  createdAt: Date;
  updatedAt: string;
}

export interface RegisteringUser {
  username: string;
  email: string;
  password: string;
}
