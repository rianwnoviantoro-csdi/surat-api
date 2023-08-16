import { v2 } from "cloudinary";

import { env } from "@configs/env";

export const uploadPDF = (file: any, folderName: string) => {
  return new Promise<object>((resolve, reject) => {
    v2.config({
      cloud_name: env.cloudinaryName,
      api_key: env.cloudinaryKey,
      api_secret: env.cloudinarySecret,
    });

    v2.uploader
      .upload_stream(
        {
          format: "pdf",
          resource_type: "raw",
          folder: folderName, // Specify the folder path here
          public_id: new Date().getTime().toString(),
        },
        (error: any, result: any) => {
          result ? resolve(result) : reject(error);
        }
      )
      .end(file.buffer);
  });
};
