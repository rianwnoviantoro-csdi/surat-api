import Joi from "joi";

import { LoginDto } from "@dtos/user";

export const loginSchema = Joi.object<LoginDto>({
  email: Joi.string().required(),
  password: Joi.string().min(8).required(),
});
