import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  current: { type: Number, default: 0 },
  deadline: { type: Date }, // opcional
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Goal = mongoose.model("Goal", goalSchema);
