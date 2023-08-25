import Joi from "joi";

import { NewMailDto } from "../dto/outgoing-mail";

export const createOutgingMailSchema = Joi.object<NewMailDto>({
  agenda: Joi.string().allow(null),
  number: Joi.string().allow(null),
  year: Joi.string().allow(null),
  regarding: Joi.string().allow(null),
  destination: Joi.string().allow(null),
  explanation: Joi.string().allow(null),
  evidence: Joi.any().meta({ swaggerType: "file" }).optional().allow(null),
  attachment: Joi.string().allow(null),
  mailingDate: Joi.date().allow(null),
  archiver: Joi.string().allow(null),
});
