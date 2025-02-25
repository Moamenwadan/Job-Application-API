import joi from "joi";
import { isValidObjectId } from "mongoose";
export const addCompany = joi
  .object({
    companyName: joi.string().required(),
    companyEmail: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi.number().required(),
    HRs: joi.array().items(joi.string().required()),
    CreatedBy: joi.custom(isValidObjectId),
  })
  .required();
export const updateCompany = joi
  .object({
    companyName: joi.string(),
    companyEmail: joi.string(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.number(),
    HRs: joi.array().items(joi.string().required()),
    CreatedBy: joi.custom(isValidObjectId),
    companyId: joi.custom(isValidObjectId),
  })
  .required();
export const deleteCompany = joi
  .object({
    companyId: joi.custom(isValidObjectId),
  })
  .required();
export const getSpecificCompany = joi
  .object({
    companyId: joi.custom(isValidObjectId),
  })
  .required();
export const getSpecificCompanyByName = joi.object({
  companyName: joi.custom(isValidObjectId),
});

export const uploadLogo = joi
  .object({
    companyId: joi.custom(isValidObjectId),
    file: joi.object({
      fieldname: joi.string().valid("image").required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      size: joi.number().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
    }),
  })
  .required();

export const coverPic = joi
  .object({
    companyId: joi.custom(isValidObjectId),
    file: joi.object({
      fieldname: joi.string().valid("image").required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      size: joi.number().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
    }),
  })
  .required();
export const deleteLogo = joi
  .object({
    companyId: joi.custom(isValidObjectId),
  })
  .required();
export const deleteCover = joi
  .object({
    companyId: joi.custom(isValidObjectId),
  })
  .required();
