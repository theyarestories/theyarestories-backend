// import { IReview } from "@/interfaces/reviews/IReview";
// import { Schema, model } from "mongoose";
// import { MovieSchema } from "./MovieScehma";

// export const ReviewSchema = new Schema<IReview>(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       required: [true, "Please add a user ID"],
//       ref: "User",
//     },
//     userDetails: {
//       username: {
//         type: String,
//         required: [true, "Please add a username"],
//       },
//       displayName: {
//         type: String,
//         required: [true, "Please add a username"],
//       },
//       avatar: {
//         type: String,
//         required: [true, "Please add an avatar"],
//       },
//     },
//     movieDetails: MovieSchema,
//     rating: {
//       type: Number,
//       required: [true, "Please add a rating"],
//     },
//     review: {
//       type: String,
//       default: "",
//     },
//     likers: {
//       type: [String],
//       default: [],
//     },
//     savers: {
//       type: [String],
//       default: [],
//     },
//     sharers: {
//       type: [String],
//       default: [],
//     },
//     comments: {
//       type: Schema.Types.Mixed,
//       default: [],
//     },
//     isDeleted: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const ReviewModel = model<IReview>("Review", ReviewSchema);

// export default ReviewModel;
