import { model, Schema } from "mongoose";

const otpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    type: { type: String, enum: ["confirmEmail", "forgetPassword"] },
  },
  { timestamps: true }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600000 });
const OTP = model("OTP", otpSchema);
export default OTP;
