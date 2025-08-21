import mongoose from "mongoose";

const kbSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    tags: [String]
  },
  { timestamps: true }
);

export default mongoose.model("KB", kbSchema);
