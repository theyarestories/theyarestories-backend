import { IStory, StoryTranslatedFields } from "@/interfaces/story/IStory";
import { Schema, model } from "mongoose";

const TranslatedSchema = new Schema<StoryTranslatedFields>(
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
    job: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    _id: false,
  }
);

export const StorySchema = new Schema<IStory>(
  {
    ...TranslatedSchema.obj,
    dateOfBirth: {
      type: Date,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
      default: "",
    },
    images: {
      type: [String],
      required: false,
      default: [],
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
    translations: {
      type: Schema.Types.Map,
      of: TranslatedSchema,
    },
  },
  {
    timestamps: true,
  }
);

const StoryModel = model<IStory>("Story", StorySchema);

export default StoryModel;
