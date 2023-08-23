import Joi from "joi";

import { LoginDto } from "../dto/user";

export const loginSchema = Joi.object<LoginDto>({
  email: Joi.string().required(),
  password: Joi.string().min(8).required(),
});
