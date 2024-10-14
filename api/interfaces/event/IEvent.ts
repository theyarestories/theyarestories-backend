import { Types } from "mongoose";

export interface IEvent {
  _id: Types.ObjectId;
  type: EventType;
  metadata: object;
  createdAt: string;
  updatedAt: string;
}

export interface RegisteringEvent {
  type: EventType;
  metadata: object;
}

export enum EventType {
  visit = "visit",
  write_story = "write_story",
  translate_story = "translate_story",
  view_story = "view_story",
}
