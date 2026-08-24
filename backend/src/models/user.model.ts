import { Schema, model, Document, Types } from "mongoose";

export interface IUser {
  clerkId: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends IUser, Document<Types.ObjectId> {}

const userSchema = new Schema<UserDocument>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = model<UserDocument>("User", userSchema);
