import { IStory } from "@/interfaces/story/IStory";
import { Schema, model } from "mongoose";

export const StorySchema = new Schema<IStory>(
  {
    protagonist: {
      type: String,
      required: [true, "Please add protagonist name"],
    },
    city: {
      type: String,
      required: [true, "Please add city"],
    },
    story: {
      type: String,
      required: [true, "Please add protagonist story"],
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    images: {
      type: [String],
      required: false,
      default: [],
    },
    job: {
      type: String,
      required: false,
    },
    isApproved: {
      type: Boolean,
      required: false,
      default: false,
    },
    isHighlighted: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const StoryModel = model<IStory>("Story", StorySchema);

export default StoryModel;
