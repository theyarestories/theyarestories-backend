import { EmojiType } from "@/interfaces/story/EmojiType";
import { IEmoji } from "@/interfaces/story/IEmoji";
import { Schema } from "mongoose";

export const EmojiSchema = new Schema<IEmoji>(
  {
    userId: {
      type: String,
      unique: true,
      required: [true, "Please add user ID"],
    },
    emojiType: {
      type: String,
      enum: Object.values(EmojiType),
      required: [true, "Please add emoji type"],
    },
  },
  { timestamps: true }
);
