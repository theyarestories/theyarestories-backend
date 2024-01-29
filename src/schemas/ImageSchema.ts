import { IImage } from "@/interfaces/story/IImage";
import { Schema } from "mongoose";

export const ImageSchema = new Schema<IImage>({
  cloudinaryId: {
    type: String,
    required: [true, "Please add image Cloudinary ID"],
  },
  url: {
    type: String,
    required: [true, "Please add image URL"],
  },
});
