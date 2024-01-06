import { Types } from "mongoose";

export interface IEvent {
  _id: Types.ObjectId;
  type: "visit";
  metadata: object;
  createdAt: string;
  updatedAt: string;
}

export interface RegisteringEvent {
  type: "visit";
  metadata: object;
}
