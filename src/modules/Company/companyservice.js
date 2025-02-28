import Company from "../../DB/models/company.model.js";
import Job from "../../DB/models/job.model.js";
import User, {
  defaultpublic_id,
  defaultSecure_url,
} from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHanler.js";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";
export const addCompany = asyncHandler(async (req, res, next) => {
  const {
    companyName,
    companyEmail,
    description,
    industry,
    address,
    numberOfEmployees,
    approvedByAdmin,
    HRs,
  } = req.body;
  const user = await User.findOne({ _id: req.user._id, deleted: false });
  if (!user) next(new Error("the user doesn't exist", { cause: 404 }));
  const company = await Company.create({
    companyName,
    companyEmail,
    description,
    industry,
    address,
    numberOfEmployees,
    approvedByAdmin,
    CreatedBy: req.user._id,
    HRs,
  });
  return res.status(200).json({ success: true, company });
});
export const updateCompanyData = asyncHandler(async (req, res, next) => {
  const {
    companyName,
    companyEmail,
    description,
    industry,
    address,
    numberOfEmployees,
    approvedByAdmin,
    HRs,
  } = req.body;
  const { companyId } = req.params;
  const user = await User.findOne({ _id: req.user._id, deleted: false });
  if (!user) next(new Error("the user doesn't exist", { cause: 404 }));
  let company = await Company.findOne({
    _id: companyId,
    CreatedBy: req.user._id,
  });
  if (!company) next(new Error("the company doesn't exist"));
  let updatedData;
  if (user._id.toString() == company.CreatedBy.toString()) {
    updatedData = company = await Company.findByIdAndUpdate(
      companyId,
      {
        companyName,
        companyEmail,
        description,
        industry,
        address,
        numberOfEmployees,
        approvedByAdmin,
        HRs,
      },
      {
        runValidators: true,
        new: true,
      }
    );
  }
  return res.status(200).json({ success: true, company: updatedData });
});
export const softDeleteCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const user = await User.findOne({ _id: req.user._id, deleted: false });
  if (!user) next(new Error("the user doesn't exist", { cause: 404 }));
  const company = await Company.findOne({
    _id: companyId,
    deletedAt: null,
  });
  if (!company) next(new Error("the company doesn't exist"));
  if (user._id.toString() == company.CreatedBy.toString()) {
    company.deletedAt = Date.now();
    await company.save();
  }

  return res
    .status(200)
    .json({ success: true, companyDeletedAt: company.deletedAt });
});
export const getSpecificCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const user = await User.findOne({ _id: req.user._id, deleted: false });
  if (!user) next(new Error("the user doesn't exist", { cause: 404 }));
  const company = await Company.findOne({
    _id: companyId,
  }).populate({ path: "jobs" });
  if (!company) next(new Error("the company doesn't exist"));

  return res.status(200).json({ success: true, company });
});
export const getSpecificCompanyByName = asyncHandler(async (req, res, next) => {
  const { companyName } = req.params;
  const user = await User.findOne({ _id: req.user._id, deleted: false });
  if (!user) next(new Error("the user doesn't exist", { cause: 404 }));
  const company = await Company.findOne({
    companyName,
  });
  console.log(user);
  console.log(company);
  if (!company) next(new Error("the company doesn't exist"));
  if (user._id.toString() == company.CreatedBy.toString()) {
    company.deletedAt = Date.now();
    await company.save();
  }
  return res.status(200).json({ success: true, company });
});
export const uploadLogo = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const user = await User.findOne({ _id: req.user._id, deleted: false });
  if (!user) next(new Error("the user doesn't exist", { cause: 404 }));
  const company = await Company.findOne({
    _id: companyId,
    CreatedBy: req.user._id,
  });
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `jobApplication/companies/${company._id}/logo/` }
    );
    company.Logo = { secure_url, public_id };
    await company.save();
  }

  return res.status(200).json({ success: true, company });
});
export const coverPic = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const user = await User.findOne({ _id: req.user._id, deleted: false });
  if (!user) next(new Error("the user doesn't exist", { cause: 404 }));
  const company = await Company.findOne({
    _id: companyId,
    CreatedBy: req.user._id,
  });
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `jobApplication/companies/${company._id}/coverPic/` }
    );
    company.coverPic = { secure_url, public_id };
    await company.save();
  }

  return res.status(200).json({ success: true, company });
});
export const deleteLogo = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const user = await User.findOne({ _id: req.user._id, deleted: false });
  if (!user) next(new Error("the user doesn't exist", { cause: 404 }));
  const company = await Company.findOne({
    _id: companyId,
    CreatedBy: req.user._id,
  });
  if (!company) next(new Error("the company doesn't  exist", { cause: 404 }));

  await cloudinary.uploader.destroy(company.Logo.public_id);
  company.Logo = {
    secure_url: defaultSecure_url,
    public_id: defaultpublic_id,
  };
  await company.save();

  return res.status(200).json({ success: true, company });
});
export const deleteCover = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const user = await User.findOne({ _id: req.user._id, deleted: false });
  if (!user) next(new Error("the user doesn't exist", { cause: 404 }));
  const company = await Company.findOne({
    _id: companyId,
    CreatedBy: req.user._id,
  });
  if (!company)
    next(
      new Error("the company doesn't  exist or not authorized", { cause: 404 })
    );

  await cloudinary.uploader.destroy(company.coverPic.public_id);
  company.coverPic = {
    secure_url: defaultSecure_url,
    public_id: defaultpublic_id,
  };
  await company.save();

  return res.status(200).json({ success: true, company });
});
