import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    passwordHash: String,
    name: String,
    isAdmin: { type: Boolean, default: false },
    isHumanAgent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
