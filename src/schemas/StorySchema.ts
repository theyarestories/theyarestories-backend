import {
  IStory,
  Image,
  StoryTranslatedFields,
} from "@/interfaces/story/IStory";
import { Schema, model } from "mongoose";

const TranslatedSchema = new Schema<StoryTranslatedFields>(
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

export const ImageSchema = new Schema<Image>({
  cloudinaryId: {
    type: String,
    required: [true, "Please add image Cloudinary ID"],
  },
  url: {
    type: String,
    required: [true, "Please add image URL"],
  },
});

export const StorySchema = new Schema<IStory>(
  {
    protagonist: {
      type: String,
      required: [true, "Please add protagonist name"],
    },
    protagonistTranslations: {
      type: [String],
      required: false,
      default: [],
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
    age: {
      type: Number,
      required: false,
      default: null,
    },
    avatar: {
      type: ImageSchema,
      required: false,
      default: {
        cloudinaryId: "y1pfmhr4emnfk2aafwso",
        url: "https://res.cloudinary.com/dfddvb63i/image/upload/v1704320570/y1pfmhr4emnfk2aafwso.jpg",
      },
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    },
    viewsCount: {
      type: Number,
      required: false,
      default: 0,
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
    shares: {
      type: Schema.Types.Map,
      of: Number,
      required: false,
      default: {},
    },
    translationLanguage: {
      type: String,
      required: [true, "Please add translation language"],
    },
    translations: {
      // type: Schema.Types.Map,
      type: [TranslatedSchema],
      required: [true, "Please add translations array"],
    },
  },
  {
    timestamps: true,
  }
);

const StoryModel = model<IStory>("Story", StorySchema);

export default StoryModel;
