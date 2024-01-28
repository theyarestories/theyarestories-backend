import { EmojiType } from "@/interfaces/story/EmojiType";
import { ILike } from "@/interfaces/story/ILike";
import { Schema } from "mongoose";

export const LikeSchema = new Schema<ILike>(
  {
    userId: {
      type: String,
      required: [true, "Please add user ID"],
    },
    emoji: {
      type: String,
      enum: Object.values(EmojiType),
      required: [true, "Please add emoji type"],
    },
  },
  { timestamps: true }
);
