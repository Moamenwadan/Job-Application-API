import { Router } from "express";
import * as jobService from "./job.service.js";
import isAuthuenticated from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { roles } from "../../DB/models/user.model.js";
import validation from "../../middleware/validation.midddleware.js";
import * as jobSchemaValidation from "./job.validation.js";
import { upload } from "../../utils/fileUploading/multerUploading.js";
import { fileValidation } from "../../utils/fileUploading/multerUploading.js";
import uploadCloud from "../../utils/fileUploading/multerCloud.js";
const router = Router({ mergeParams: true });
// add job
router.post(
  "/addJob/:companyId",
  isAuthuenticated,
  isAuthorized(roles.admin, roles.user),
  validation(jobSchemaValidation.addJob),
  jobService.addJob
);
// update job
router.patch(
  "/updateJob/:jobId",
  isAuthuenticated,
  isAuthorized(roles.admin, roles.user),
  validation(jobSchemaValidation.updateJob),
  jobService.updateJob
);
// delete job
router.delete(
  "/deleteJob/:jobId",
  isAuthuenticated,
  isAuthorized(roles.admin, roles.user),
  validation(jobSchemaValidation.deleteJob),
  jobService.deleteJob
);
// get jobs
router.get(
  "/findJobs",
  isAuthuenticated,
  isAuthorized(roles.admin, roles.user),
  validation(jobSchemaValidation.getJob),
  jobService.getJob
);
// filter job
router.get(
  "/filterJobs",
  isAuthuenticated,
  isAuthorized(roles.admin, roles.user),
  validation(jobSchemaValidation.filterJob),
  jobService.filterJobs
);

router.post(
  "/addApplication/:jobId",
  isAuthuenticated,
  isAuthorized(roles.user),
  uploadCloud(fileValidation.files).single("pdf"),
  validation(jobSchemaValidation.addApplication),
  jobService.addApplication
);
// get all application for specific job
router.patch(
  "/handleAcceptedAndRejeted/:applicationId",
  isAuthuenticated,
  //   isAuthorized(roles.admin),
  //   validation(jobSchemaValidation.addApplication),
  jobService.handleAcceptAndRefuse
);
export default router;
