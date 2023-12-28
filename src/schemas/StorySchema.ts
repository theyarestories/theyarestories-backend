import {
  IStory,
  Image,
  StoryTranslatedFields,
} from "@/interfaces/story/IStory";
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
      default: null,
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
    shares: {
      type: Schema.Types.Map,
      of: Number,
      required: false,
      default: {},
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
