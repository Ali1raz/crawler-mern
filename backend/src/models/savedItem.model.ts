import { Schema, model, Document, Types } from "mongoose";

export interface ISavedItem {
  userId: Types.ObjectId;
  url: string;
  title?: string;
  content?: string;
  summary?: string;
  tags: string[];
  author?: string;
  publishedAt?: Date;
  ogImage?: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
}

export interface SavedItemDocument extends ISavedItem, Document<Types.ObjectId> {}

const savedItemSchema = new Schema<SavedItemDocument>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    title: { type: String },
    content: { type: String },
    summary: { type: String },
    tags: { type: [String], default: [] },
    author: { type: String },
    publishedAt: { type: Date },
    ogImage: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const SavedItem = model<SavedItemDocument>("SavedItem", savedItemSchema);