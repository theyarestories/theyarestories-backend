import { Model, model, Schema } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, UserRole } from "@/interfaces/user/IUser";
import { IUserMethods } from "@/interfaces/user/IUserMethods";
import emailValidationRegex from "@/utils/regex/emailValidationRegex";

export interface IUserModel extends Model<IUser, {}, IUserMethods> {}

export const UserSchema = new Schema<IUser, IUserModel>(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [emailValidationRegex, "Please add a valid email"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.user,
    },
    avatar: {
      type: String,
      required: false,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      select: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpire: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// encrypt password using bcrypt
UserSchema.pre("save", async function encryptPassword(next) {
  if (!this.isModified("password")) {
    next();
  }

  // password
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

/* 
فايدة التوكن انها بتتبعت مع اي ريكويست بعد تسجيل الدخول
for authentication
*/
UserSchema.methods.getSignedJwtToken = function (): string {
  // "this" here refers to the instance (document)
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET ?? "", {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const match = await bcrypt.compare(enteredPassword, this.password);
  return match;
};

/** A great article to read: https://www.freecodecamp.org/news/do-you-want-a-better-understanding-of-buffer-in-node-js-check-this-out-2e29de2968e8/
  - Buffer, data streams, binary data
 */

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 60 * 1000; // 10 mins

  return resetToken;
};

const UserModel = model<IUser, IUserModel>("User", UserSchema);

export default UserModel;
