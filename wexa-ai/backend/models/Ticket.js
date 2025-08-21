import mongoose from "mongoose"

const TicketSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    userId: String,
    status: { type: String, default: "open" }, // open, resolved, pending_human
    draft: { type: String, default: "" },
    category: { type: String, default: "" },
    needsHuman: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default mongoose.model("Ticket", TicketSchema);
