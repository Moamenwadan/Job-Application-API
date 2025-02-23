import joi from "joi";
import { genders } from "../../DB/models/user.model.js";

export const registerSchema = joi
  .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")),
    gender: joi.string().valid(...Object.values(genders)),
    mobileNumber: joi.string().required(),
    DOB: joi.string().required(),
    otp: joi.string().required(),
    type: joi.string().valid("confirmEmail", "forgetPassword").required(),
  })
  .required();
export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();
export const sendOTP = joi
  .array()
  .items(
    joi.object({
      email: joi.string().email().required(),
      type: joi.string().valid("confirmEmail", "forgetPassword").required(),
    })
  )
  .required();
export const forgetPassword = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();
export const resetPassword = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")),
    otp: joi.string().required(),
  })
  .required();
export const newAccess = joi
  .object({
    refresh_token: joi.string().required(),
  })
  .required();

export const loginWithGmail = joi
  .object({
    idToken: joi.string().required(),
  })
  .required();
