import { ITranslation } from "@/interfaces/story/IStory";
import { Schema } from "mongoose";

export const TranslationSchema = new Schema<ITranslation>(
  {
    fromLanguage: {
      type: String,
      required: [true, "Please add the language the story is translated from"],
    },
    translationLanguage: {
      type: String,
      required: [true, "Please add the language the story is translated to"],
    },
    protagonist: {
      type: String,
      required: [true, "Please add protagonist name"],
    },
    author: {
      type: String,
      required: [true, "Please add translation author"],
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
    isApproved: {
      type: Boolean,
      required: false,
      default: false,
    },
    approvedBy: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);
