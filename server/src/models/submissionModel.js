import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  problemSlug: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  verdict: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const submissionModel =
  mongoose.models.submission || mongoose.model("submission", submissionSchema);

export default submissionModel;
