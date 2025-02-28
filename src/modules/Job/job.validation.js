import joi from "joi";
import { seniorityLevels, workingTimes } from "../../DB/models/job.model.js";
import { isValidObjectId } from "mongoose";

export const addJob = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi
      .string()
      .valid(workingTimes.fullTime, workingTimes.partTime)
      .required(),
    seniorityLevel: joi
      .string()
      .valid(
        seniorityLevels.fresh,
        seniorityLevels.junior,
        seniorityLevels.midLevel,
        seniorityLevels.senior,
        seniorityLevels.TeamLead,
        seniorityLevels.cto
      )
      .required(),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    companyId: joi.custom(isValidObjectId),
  })
  .required();
export const updateJob = joi
  .object({
    jobTitle: joi.string(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi
      .string()
      .valid(workingTimes.fullTime, workingTimes.partTime),
    seniorityLevel: joi
      .string()
      .valid(
        seniorityLevels.fresh,
        seniorityLevels.junior,
        seniorityLevels.midLevel,
        seniorityLevels.senior,
        seniorityLevels.TeamLead,
        seniorityLevels.cto
      ),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    companyId: joi.custom(isValidObjectId),
    jobId: joi.custom(isValidObjectId),
  })
  .required();
export const deleteJob = joi
  .object({
    companyId: joi.custom(isValidObjectId),
    jobId: joi.custom(isValidObjectId),
  })
  .required();
export const getJob = joi
  .object({
    companyId: joi.custom(isValidObjectId).required(),
    page: joi.number().required(),
  })
  .required();
export const filterJob = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi
      .string()
      .valid(workingTimes.fullTime, workingTimes.partTime)
      .required(),
    seniorityLevel: joi
      .string()
      .valid(
        seniorityLevels.fresh,
        seniorityLevels.junior,
        seniorityLevels.midLevel,
        seniorityLevels.senior,
        seniorityLevels.TeamLead,
        seniorityLevels.cto
      )
      .required(),
    page: joi.number().required(),
  })
  .required();
export const addApplication = joi
  .object({
    jobId: joi.custom(isValidObjectId).required(),
    file: joi.object({
      fieldname: joi.string().valid("pdf").required(),
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
