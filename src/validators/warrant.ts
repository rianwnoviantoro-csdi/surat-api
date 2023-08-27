import Joi from "joi";

import { NewMailDto } from "../dto/warrant";

export const createWarrantSchema = Joi.object<NewMailDto>({
  agenda: Joi.string().allow(null, ""),
  number: Joi.string().allow(null, ""),
  year: Joi.string().allow(null, ""),
  evidence: Joi.any().meta({ swaggerType: "file" }).optional().allow(null, ""),
  attachment: Joi.string().allow(null, ""),
  dipa: Joi.boolean().default(false),
  employee: Joi.string().allow(null, ""),
  place: Joi.string().allow(null, ""),
  program: Joi.string().allow(null, ""),
  startDate: Joi.date().allow(null, ""),
  endDate: Joi.date().allow(null, ""),
  mailingDate: Joi.date().allow(null, ""),
  archiver: Joi.string().allow(null, ""),
  is_active: Joi.boolean().default(true),
});
