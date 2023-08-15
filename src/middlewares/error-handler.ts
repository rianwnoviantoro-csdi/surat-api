import { Request, Response, NextFunction } from "express";

import ApiError from "@configs/api-error";

export function ErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
