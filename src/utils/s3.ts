import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import S3 from "@configs/s3";

export async function uploadToS3(filename: string, buffer: Buffer) {
  return new Promise<any>((resolve, reject) => {
    S3.send(
      new PutObjectCommand({
        Bucket: "belajarawss3",
        Key: filename,
        Body: buffer,
      }),
      async (err, data) => {
        if (err) {
          reject(err);
        } else {
          const objectUrl = `https://belajarawss3.s3.amazonaws.com/${filename.replace(
            / /g,
            "%20"
          )}`;

          resolve(objectUrl);
        }
      }
    );
  });
}

export async function GetObject(key: string) {
  return new Promise<any>((resolve, reject) => {
    S3.send(
      new GetObjectCommand({
        Bucket: "belajarawss3",
        Key: key,
      })
    ),
      async (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      };
  });
}

export async function DeleteObject(key: string) {
  return new Promise<any>((resolve, reject) => {
    S3.send(
      new DeleteObjectCommand({
        Bucket: "belajarawss3",
        Key: key,
      })
    ),
      async (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      };
  });
}
