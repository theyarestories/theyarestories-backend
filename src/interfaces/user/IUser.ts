import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: string;
}

export interface RegisteringUser {
  username: string;
  email: string;
  password: string;
}
