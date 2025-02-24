import multer, { diskStorage } from "multer";

export const fileValidation = {
  images: ["image/png", "image/jpeg"],
  files: ["application/pdf"],
};

export const uploadCloud = (fileType) => {
  const storage = diskStorage({});

  const fileFilter = (req, file, cb) => {
    // console.log(file.mimetype);
    // if (file.mimetype !== "image/jpeg")
    if (!fileType.includes(file.mimetype))
      return cb(new Error(`invalid  format`), false);
    return cb(null, true);
  };
  const muterUpload = multer({ storage, fileFilter });
  return muterUpload;
};

export default uploadCloud;
