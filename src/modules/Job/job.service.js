import Application, {
  statusOfApplication,
} from "../../DB/models/application.model.js";
import Company from "../../DB/models/company.model.js";
import Job from "../../DB/models/job.model.js";
import User from "../../DB/models/user.model.js";
import { handleAcceptAndRefuseHTML } from "../../utils/emails/generateHTML.js";
import sendEmail from "../../utils/emails/sendEmail.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHanler.js";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";

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
  const user = await User.findOne({ _id: req.user._id, deleted: false });
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
  const user = await User.findOne({ _id: req.user._id, deleted: false });
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
  const user = await User.findOne({ _id: req.user._id, deleted: false });
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
export const getJob = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const { page } = req.query;

  const company = await Company.findById(companyId);
  if (!company)
    return next(new Error("the company doesn't exist", { cause: 404 }));
  const jobs = await Job.find({ companyId: { $in: [companyId] } }).paginate(
    page
  );
  if (!jobs)
    return next(new Error("the company doesn't have jobs", { cause: 404 }));

  return res.status(200).json({
    success: true,
    message: "find jobs successfully successfully",
    jobs,
  });
});
export const filterJobs = asyncHandler(async (req, res, next) => {
  const { page } = req.query;
  const { workingTime, jobLocation, jobTitle, seniorityLevel } = req.body;

  const jobs = await Job.find({
    workingTime,
    jobLocation,
    jobTitle,
    seniorityLevel: seniorityLevel,
  }).paginate(page);
  if (!jobs)
    return next(new Error("the company doesn't have jobs", { cause: 404 }));

  return res
    .status(200)
    .json({ success: true, message: "filter successfully", jobs });
});
export const addApplication = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const user = await User.findOne({ _id: req.user._id, deleted: false });
  if (!user) return next(new Error("the user doesn't exist", { cause: 404 }));
  const job = await Job.findById(jobId);
  if (!job) return next(new Error("the company doesn't exist", { cause: 404 }));
  if (req.file) {
    const application = await Application.create({
      jobId,
      userId: req.user._id,
    });
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `jobApplication/users/${user._id}/userCV/` }
    );
    application.userCV = { secure_url, public_id };
    await application.save();

    return res.status(200).json({
      success: true,
      message: "add applicatio successfully",
      application,
    });
  }
});
export const allApplication = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId).populate({
    path: "applications",
    populate: {
      path: "userId", // Populate the user data for each application
      select: "firstName lastName email profilePicture", // Select specific fields
    },
  });
  if (!job) return next(new Error("the user doesn't exist", { cause: 404 }));

  if (req.user.id == job.applications.userId) {
    return res.status(200).json({
      success: true,
      message: "add applicatio successfully",
      job,
    });
  } else {
    next(new Error("not authorized"));
  }
});
export const handleAcceptAndRefuse = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const { decision } = req.body; // "accepted" or "rejected"
  const userId = req.user._id;

  // Find the application
  const application = await Application.findById(applicationId).populate(
    "userId"
  );
  //   console.log(application);
  if (!application) {
    return next(new Error("Application not found", { cause: 404 }));
  }

  // Find the job associated with the application
  const job = await Job.findById(application.jobId);
  if (!job) {
    return next(new Error("Job not found", { cause: 404 }));
  }
  const company = await Company.findOne({
    _id: { $in: job.companyId },
    HRs: { $in: userId },
  });
  if (!company) {
    return next(
      new Error("You are not authorized to make this decision", {
        cause: 403,
      })
    );
  }
  if (decision === statusOfApplication.accepted) {
    application.status = decision;
    await sendEmail({
      to: application.userId.email,
      subject: "statusOfApplication",
      html: handleAcceptAndRefuseHTML(decision),
    });
    await application.save();
  } else if (decision === statusOfApplication.rejected) {
    application.status = decision;
    await sendEmail({
      to: application.userId.email,
      subject: "statusOfApplication",
      html: handleAcceptAndRefuseHTML(decision),
    });

    await application.save();
  }
  res.json({ success: true, message: "handle successfully" });
});
