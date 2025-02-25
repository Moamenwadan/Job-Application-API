import { Router } from "express";
import * as companyService from "./companyservice.js";
import isAuthuenticated from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { roles } from "../../DB/models/user.model.js";
import validation from "../../middleware/validation.midddleware.js";
import * as companySchemaValidation from "./company.validation.js";
import { upload } from "../../utils/fileUploading/multerUploading.js";
import { fileValidation } from "../../utils/fileUploading/multerUploading.js";
import uploadCloud from "../../utils/fileUploading/multerCloud.js";
const router = Router();
// addCompany
router.post(
  "/addCompany",
  isAuthuenticated,
  validation(companySchemaValidation.addCompany),
  companyService.addCompany
);
// update company
router.patch(
  "/updateCompany/:companyId",
  isAuthuenticated,
  validation(companySchemaValidation.updateCompany),
  companyService.updateCompanyData
);
router.delete(
  "/deleteCompany/:companyId",
  isAuthuenticated,
  validation(companySchemaValidation.deleteCompany),
  companyService.softDeleteCompany
);
// get specific company
router.get(
  "/getCompany/:companyId",
  isAuthuenticated,
  validation(companySchemaValidation.getSpecificCompany),
  companyService.getSpecificCompany
);
// get specific company by name
router.get(
  "/getCompanyByName/:companyName",
  isAuthuenticated,
  validation(companySchemaValidation.getSpecificCompanyByName),
  companyService.getSpecificCompanyByName
);
// upload company logo
router.post(
  "/uploadLogo/:companyId",
  isAuthuenticated,
  uploadCloud(fileValidation.images).single("image"),
  validation(companySchemaValidation.uploadLogo),
  companyService.uploadLogo
);
// cover
router.post(
  "/uploadCover/:companyId",
  isAuthuenticated,
  uploadCloud(fileValidation.images).single("image"),
  validation(companySchemaValidation.coverPic),
  companyService.coverPic
);
router.post(
  "/deleteLogo/:companyId",
  isAuthuenticated,
  validation(companySchemaValidation.deleteLogo),
  companyService.deleteLogo
);
router.post(
  "/deleteCover/:companyId",
  isAuthuenticated,
  validation(companySchemaValidation.deleteCover),
  companyService.deleteCover
);

export default router;
