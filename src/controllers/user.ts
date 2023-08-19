import { ValidationError } from "joi";
import { Response } from "express";

import ApiError from "@configs/api-error";
import { RequestWithUser } from "@middlewares/auth";
import UserService from "@services/user";

export default class UserController {
  constructor(private userService: UserService) {}

  async getProfile(req: RequestWithUser, res: Response) {
    try {
      return res.success(
        await this.userService.profile(req.user?.uuid as string)
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.error(error.status, error.message);
      } else if (error instanceof ValidationError) {
        const errorMessages = error.details.map((err) => err.message);
        res.error(400, errorMessages);
      } else {
        console.log(error.message);
        res.error(500, "Internal Server Error");
      }
    }
  }
}
