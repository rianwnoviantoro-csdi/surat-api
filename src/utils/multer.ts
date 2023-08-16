import { Request } from "express";
import multer from "multer";

const storage = multer.memoryStorage();

function fileFilter(req: Request, file: any, callback: any) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "application/pdf"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

const upload = multer({ storage, fileFilter });

const fileSizeFormatter = (bytes: number, decimal: number) => {
  if (bytes === 0) return "0 Bytes";

  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};

export default {
  upload,
  fileSizeFormatter,
};
