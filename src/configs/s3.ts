import { S3Client } from "@aws-sdk/client-s3";

import { env } from "@configs/env";

export default new S3Client({
  region: env.s3Region,
  credentials: {
    accessKeyId: env.s3Access,
    secretAccessKey: env.s3Secret,
  },
});
