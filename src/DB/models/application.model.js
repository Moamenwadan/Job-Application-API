import { hash } from "../../utils/hashing/hash.js";
import { Schema, Types, model } from "mongoose";
import { defaultpublic_id, defaultSecure_url } from "./user.model.js";

export const statusOfApplication = {
  pending: "pending",
  accepted: "accepted",
  viewed: "viewed",
  rejected: "rejected",
};
const applicationSchema = new Schema(
  {
    jobId: { type: Types.ObjectId, ref: "Job" },
    userId: { type: Types.ObjectId, ref: "User" },
    userCV: {
      secure_url: { type: String, default: defaultSecure_url },
      public_id: { type: String, default: defaultpublic_id },
    },
    status: {
      type: String,
      enum: Object.values(statusOfApplication),
      default: statusOfApplication.pending,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Application = model("Application", applicationSchema);

export default Application;
