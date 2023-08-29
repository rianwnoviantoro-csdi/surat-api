import { Response } from "express";
import { ValidationError } from "joi";

import ApiError from "../configs/api-error";
import { RequestWithUser } from "../middlewares/auth";
import CommonService from "../services/common";

export default class CommonController {
  constructor(private readonly commonService: CommonService) {}

  async countMail(req: RequestWithUser, res: Response) {
    try {
      res.success(await this.commonService.countMail());
    } catch (error) {
      if (error instanceof ApiError) {
        res.error(error.status, error.message);
      } else if (error instanceof ValidationError) {
        const errorMessages = error.details.map((err) => err.message);
        res.error(400, errorMessages);
      } else {
        console.log(error);
        res.error(500, "Internal Server Error");
      }
    }
  }
}
