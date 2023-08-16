import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import ApiError from "@configs/api-error";
import { env } from "@configs/env";

export interface IDecode extends JwtPayload {
  uuid: string;
  name: string;
}

export interface RequestWithUser extends Request {
  user?: IDecode;
}

export default function UseAuth(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    const header: string = req.headers.authorization as string;

    if (!header?.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized.");
    }

    const token: string = header.split(" ")[1];

    const decoded = <IDecode>jwt.verify(token, env.secret);

    if (!decoded) throw new ApiError(401, "Unauthorized.");

    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      res.error(error.status, error.message);
    } else {
      res.error(500, "Internal Server Error");
    }
  }
}
