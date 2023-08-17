import CryptoJS from "crypto-js";

import { env } from "@configs/env";

export function encryptData(data: any) {
  return CryptoJS.AES.encrypt(data, env.secret).toString();
}

export function decryptData(encryptedData: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, env.secret);
  return bytes.toString(CryptoJS.enc.Utf8);
}
