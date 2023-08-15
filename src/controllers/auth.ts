import { Request, Response } from "express";
import { ValidationError } from "joi";

import AuthService from "@services/auth";
import { LoginDto } from "@dtos/user";
import { loginSchema } from "@validators/user";
import ApiError from "@configs/api-error";

export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response) {
    try {
      const body: LoginDto = req.body;

      await loginSchema.validateAsync(body, { abortEarly: false });

      const result = await this.authService.login(body, res);

      return res.success(result);
    } catch (error) {
      if (error instanceof ApiError) {
        res.error(error.status, error.message);
      } else if (error instanceof ValidationError) {
        const errorMessages = error.details.map((err) => err.message);
        res.error(400, errorMessages);
      } else {
        res.error(500, "Internal Server Error");
      }
    }
  }
}
