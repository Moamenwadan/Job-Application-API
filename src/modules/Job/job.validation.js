import joi from "joi";
import { seniorityLevel, workingTimes } from "../../DB/models/job.model.js";
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
        seniorityLevel.fresh,
        seniorityLevel.junior,
        seniorityLevel.midLevel,
        seniorityLevel.senior,
        seniorityLevel.TeamLead,
        seniorityLevel.cto
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
        seniorityLevel.fresh,
        seniorityLevel.junior,
        seniorityLevel.midLevel,
        seniorityLevel.senior,
        seniorityLevel.TeamLead,
        seniorityLevel.cto
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
