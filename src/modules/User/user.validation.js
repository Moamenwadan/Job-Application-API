import joi from "joi";
import { genders } from "../../DB/models/user.model.js";
import { isValidObjectId } from "../../middleware/validation.midddleware.js";
export const updateProfile = joi
  .object({
    firstName: joi.string(),
    lastName: joi.string(),
    gender: joi.string().valid(...Object.values(genders)),
    mobileNumber: joi.string(),
    DOB: joi.string(),
  })
  .required();
export const updatePassword = joi
  .object({
    oldPassword: joi.string().required(),
    password: joi.string().not(joi.ref("oldPassword")).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
export const shareProfile = joi
  .object({
    userId: joi.custom(isValidObjectId).required(),
  })
  .required();
