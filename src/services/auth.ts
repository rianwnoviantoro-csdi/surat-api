import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import ApiError from "../configs/api-error";
import { LoginDto } from "../dto/user";
import UserRepository from "../repositories/user";
import { env } from "../configs/env";
import { CookieOptions, Response } from "express";

export default class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(body: LoginDto, res: Response): Promise<{ token: string }> {
    const { email, password } = body;

    const existingAccount = await this.userRepository.getUserByEmail(email);

    if (!existingAccount) throw new ApiError(400, "Bad credentials.");

    const samePassword = await bcrypt.compare(
      password,
      existingAccount.password as string
    );

    if (!samePassword) throw new ApiError(400, "Bad credentials.");

    const payload = {
      uuid: existingAccount.uuid,
      name: existingAccount.name,
    };

    const token = jwt.sign(payload, env.secret, { expiresIn: "7d" });
    const refresh = jwt.sign(payload, env.refresh, { expiresIn: "30d" });

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      secure: true,
      sameSite: "none",
    };

    res.cookie("refresh", refresh, cookieOptions);

    return { token };
  }
}
