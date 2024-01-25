import { IStatistic } from "@/interfaces/statistic/IStatistic";
import { Schema, model } from "mongoose";

export const StatisticSchema = new Schema<IStatistic>(
  {
    visitCount: {
      type: Number,
      required: false,
      default: 0,
    },
    writeStoryCount: {
      type: Number,
      required: false,
      default: 0,
    },
    translateStoryCount: {
      type: Number,
      required: false,
      default: 0,
    },
    viewStoryCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

const StatisticModel = model<IStatistic>("Statistic", StatisticSchema);

export default StatisticModel;
