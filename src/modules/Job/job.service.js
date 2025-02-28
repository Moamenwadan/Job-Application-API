import Company from "../../DB/models/company.model.js";
import Job from "../../DB/models/job.model.js";
import User from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHanler.js";
export const addJob = asyncHandler(async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  const { companyId } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) return next(new Error("the user doesn't exist", { cause: 404 }));
  const company = await Company.findById(companyId);
  //   console.log(company);
  if (!company)
    return next(new Error("the company doesn't exist", { cause: 404 }));
  const checkIfJobExist = await Job.findOne({
    jobTitle,
    jobLocation,
  });

  let job;
  if (checkIfJobExist) {
    checkIfJobExist.companyId.push(companyId);
    await checkIfJobExist.save();
  } else {
    if (
      company.CreatedBy.toString() == req.user._id.toString() ||
      company.HRs.includes(req.user._id)
    ) {
      job = await Job.create({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy: req.user._id,
      });
      job.companyId.push(companyId);
      await job.save();
    } else {
      return next(new Error("not authorized to add job", { cause: 404 }));
    }
  }

  return res.status(201).json({ success: true, job: job || checkIfJobExist });
});

export const updateJob = asyncHandler(async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  const { jobId } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) return next(new Error("the user doesn't exist", { cause: 404 }));
  let job = await Job.findOne({ _id: jobId });
  if (!job)
    return next(
      new Error("the job doesn't exist ", {
        cause: 404,
      })
    );

  let updatedJob;
  if (job.addedBy.toString() == req.user._id.toString()) {
    updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, addedBy: req.user._id },
      {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
      },
      { new: true, runValidators: true }
    );
  } else {
    return next(new Error("not authorized to add job", { cause: 404 }));
  }

  return res.status(201).json({ success: true, job: job || checkIfJobExist });
});
export const deleteJob = asyncHandler(async (req, res, next) => {
  const { companyId } = req.body;
  const { jobId } = req.params;
  const company = await Company.findById(companyId);
  if (!company)
    return next(new Error("the company doesn't exist", { cause: 404 }));
  const user = await User.findById(req.user._id);
  if (!user) return next(new Error("the user doesn't exist", { cause: 404 }));
  let job = await Job.findOne({ _id: jobId });
  if (!job)
    return next(
      new Error("the job doesn't exist ", {
        cause: 404,
      })
    );

  for (const hr of company.HRs) {
    console.log(hr.toString());
    if (hr.toString() == req.user._id.toString()) {
      await Job.findOneAndDelete({ _id: jobId });
    } else {
      return next(
        new Error("Only HR can delete job ", {
          cause: 404,
        })
      );
    }
  }

  return res
    .status(201)
    .json({ success: true, message: "job deleted successfully" });
});
