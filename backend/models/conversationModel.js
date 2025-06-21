import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  conversation: [
    {
      role: { type: String, enum: ["user", "assistant", "system"] },
      content: { type: String },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});
const conversationModel =
  mongoose.models.conversation ||
  mongoose.model("conversation", conversationSchema);
export default conversationModel;
