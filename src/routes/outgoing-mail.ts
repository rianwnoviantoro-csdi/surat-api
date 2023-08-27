import { Router } from "express";

import OutgoingMailController from "../controllers/outgoing-mail";
import UseAuth from "../middlewares/auth";
import OutgoingMailRepository from "../repositories/outgoing-mail";
import UserRepository from "../repositories/user";
import OutgoingMailService from "../services/outgoing-mail";
import multer from "../utils/multer";

const outgingMailRouter: Router = Router();

const outgoingMailRepository = new OutgoingMailRepository();
const userRepository = new UserRepository();
const service = new OutgoingMailService(outgoingMailRepository, userRepository);
const controller = new OutgoingMailController(service);

// V1
outgingMailRouter.post(
  "/v1",
  UseAuth,
  multer.upload.single("evidence"),
  controller.createMail.bind(controller)
);
outgingMailRouter.get("/v1", UseAuth, controller.mailList.bind(controller));
outgingMailRouter.get(
  "/v1/:agenda",
  UseAuth,
  controller.detail.bind(controller)
);
outgingMailRouter.put(
  "/v1/:agenda",
  UseAuth,
  multer.upload.single("evidence"),
  controller.update.bind(controller)
);
outgingMailRouter.delete(
  "/v1/:agenda/soft",
  UseAuth,
  controller.softDelete.bind(controller)
);
outgingMailRouter.delete(
  "/v1/:agenda/hard",
  UseAuth,
  controller.delete.bind(controller)
);
outgingMailRouter.get(
  "/v1/:agenda/restore",
  UseAuth,
  controller.restore.bind(controller)
);

export default outgingMailRouter;
