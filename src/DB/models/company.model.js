import { hash } from "../../utils/hashing/hash.js";
import { Schema, Types, model } from "mongoose";
import { defaultpublic_id, defaultSecure_url } from "./user.model.js";

const companySchema = new Schema(
  {
    companyName: { type: String, unique: true, required: true },
    description: { type: String },
    industry: { type: String },
    address: { type: String },
    numberOfEmployees: {
      type: Number,
      min: [11, "Number of employees must be at least 11"],
      max: [20, "Number of employees must not exceed 20"],
    },
    companyEmail: {
      type: String,
      lowercase: true,
      required: true,
      unique: [true, "email must be unique"],
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    Logo: {
      secure_url: { type: String, default: defaultSecure_url },
      public_id: { type: String, default: defaultpublic_id },
    },
    coverPic: {
      secure_url: { type: String, default: defaultSecure_url },
      public_id: { type: String, default: defaultpublic_id },
    },
    legalAttachment: {
      secure_url: { type: String, default: defaultSecure_url },
      public_id: { type: String, default: defaultpublic_id },
    },
    approvedByAdmin: {
      type: Boolean,
    },
    bannedAt: { type: Date },
    deletedAt: { type: Date },
    CreatedBy: { type: Types.ObjectId, ref: "User" },
    HRs: { type: [Types.ObjectId], ref: "User" },
  },

  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
companySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
});
const Company = model("Company", companySchema);

export default Company;
