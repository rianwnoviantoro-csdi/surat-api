import Joi from "joi";

import { NewMailDto } from "../dto/incoming-mail";

export const createIncomingMailSchema = Joi.object<NewMailDto>({
  agenda: Joi.string().allow(null),
  number: Joi.string().allow(null),
  origin: Joi.string().allow(null),
  regarding: Joi.string().allow(null),
  followUp: Joi.string().allow(null),
  explanation: Joi.string().allow(null),
  evidence: Joi.any().meta({ swaggerType: "file" }).optional().allow(null),
  attachment: Joi.string().allow(null),
  recipient: Joi.string().allow(null),
  mailingDate: Joi.date().allow(null),
  receivedDate: Joi.date().allow(null),
  archiver: Joi.string().allow(null),
});
