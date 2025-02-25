// import { object, string } from "joi";
import { types } from "../../modules/Auth/auth.service.js";
import { encrypt } from "../../utils/encryption/encryption.js";
import { hash } from "../../utils/hashing/hash.js";
import { Schema, Types, model } from "mongoose";
export const genders = {
  male: "male",
  female: "female",
};
export const roles = {
  superAdmin: "superAdmin",
  admin: "admin",
  user: "user",
};

export const providers = {
  system: "system",
  google: "google",
};
export const defaultProfilePicture = "uploads/default_picture.png";

export const defaultSecure_url =
  "https://res.cloudinary.com/dr4po5j8x/image/upload/v1737901081/default_picture_brqlu4.png";
export const defaultpublic_id = "1737901081/default_picture_brqlu4";
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: [true, "email must be unique"],
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === providers.system ? true : false;
      },
    },
    gender: { type: String, enum: Object.values(genders) },
    DOB: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          if (birthDate > today) return false;
          return age >= 18 ? value : false;
        },
        message: "User must be at least 18 years old.",
      },
    },
    isConfirmed: { type: Boolean, default: false },
    mobileNumber: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(roles), default: roles.user },
    changePasswordTime: { type: Date },
    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.system,
    },
    tempEmail: { type: String, default: null },

    profilePicture: {
      secure_url: { type: String, default: defaultSecure_url },
      public_id: { type: String, default: defaultpublic_id },
    },
    coverPicture: {
      secure_url: { type: String, default: defaultSecure_url },
      public_id: { type: String, default: defaultpublic_id },
    },
    bannedAt: { type: Date, default: null },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    otp: [
      {
        code: { type: String, required: true }, // Hashed OTP Code
        type: {
          type: String,
          enum: Object.values(types),
          required: true,
        }, // OTP Type
        expiresIn: { type: Date, expires: 3600 * 6 },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
userSchema.virtual("userName").get(function () {
  return `${this.firstName.toLowerCase()} ${this.lastName.toLowerCase()}`;
});
// userSchema.pre("save", function (next) {
//   if (this.isModified("password")) {
//     this.mobileNumber = encrypt({ plainText: this.mobileNumber });
//     this.password = hash({ plainText: this.password });
//     return next();
//   }
// });
const User = model("User", userSchema);

export default User;
