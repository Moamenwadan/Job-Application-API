// import { object, string } from "joi";
// import { required } from "joi";
import { hash } from "../../utils/hashing/hash.js";
import { Schema, Types, model } from "mongoose";

export const defaultProfilePicture = "uploads/default_picture.png";

export const defaultSecure_url =
  "https://res.cloudinary.com/dr4po5j8x/image/upload/v1737901081/default_picture_brqlu4.png";
export const defaultpublic_id = "1737901081/default_picture_brqlu4";
export const jobLocations = {
  onsite: "onsite",
  remotely: "remotely",
  hybrid: "hybrid",
};
export const workingTimes = {
  partTime: "part-time",
  fullTime: "full-time",
};
export const seniorityLevel = {
  fresh: "fresh",
  junior: "Junior",
  senior: "Senior",
  midLevel: "Mid-Level",
  TeamLead: "Team-Lead",
  cto: "CTO",
};
const jobSchema = new Schema(
  {
    jobTitle: { type: String },
    jobLocation: { type: String, enum: Object.values(jobLocations) },
    workingTime: { type: String, enum: Object.values(workingTimes) },
    seniorityLevel: { type: String, enum: Object.values(seniorityLevel) },
    jobDescription: { type: String },
    technicalSkills: [String],
    softSkills: [String],
    addedBy: { type: Types.ObjectId, ref: "User" },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    closed: { type: Boolean },
    companyId: [{ type: Types.ObjectId, ref: "Company" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Job = model("Job", jobSchema);

export default Job;
