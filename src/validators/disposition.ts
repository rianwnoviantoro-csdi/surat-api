import Joi from "joi";

import { NewDispositionDto } from "@dtos/disposition";

export const createDispositionSchema = Joi.object<NewDispositionDto>({
  objective: Joi.string().allow(null),
  content: Joi.string().allow(null),
  trait: Joi.string().allow(null),
  deadline: Joi.date().allow(null),
  notation: Joi.string().allow(null),
  mail: Joi.string().allow(null),
  evidence: Joi.any().meta({ swaggerType: "file" }).optional().allow(null),
  archiver: Joi.string().allow(null),
});
