import { Types } from "mongoose";

export interface IStatistic {
  _id: Types.ObjectId;
  visitCount: number;
  writeStoryCount: number;
  translateStoryCount: number;
  viewStoryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegisteringStatistic {
  visitCount?: number;
  writeStoryCount?: number;
  translateStoryCount?: number;
  viewStoryCount?: number;
}
