import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Response {
      success(data: any): Response;
      error(status: number, message: string | string[]): Response;
    }
  }
}

export function ResponseHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.success = function (data: any): Response {
    return res.status(200).json({
      success: true,
      data,
    });
  };

  res.error = function (status: number, message: string | string[]): Response {
    return res.status(status).json({
      success: false,
      error: {
        status,
        message,
      },
    });
  };

  next();
}
