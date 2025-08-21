import mongoose from "mongoose"


const HumanProblemSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    draft: { type: String, default: "" },
    category: { type: String, default: "" },
    confidence: { type: Number, default: 0 },
    status: { type: String, enum: ["waiting_human", "resolved"], default: "waiting_human" },
  },
  { timestamps: true }
);

export default mongoose.model("HumanProblem", HumanProblemSchema);