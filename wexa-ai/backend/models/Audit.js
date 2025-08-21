import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
  action: { type: String, required: true },
  meta: { type: Object, default: {} },
  trace: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Audit", auditSchema);
