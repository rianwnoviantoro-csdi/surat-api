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
const outgoingMailservice = new OutgoingMailService(
  outgoingMailRepository,
  userRepository
);
const incomingMailcontroller = new OutgoingMailController(outgoingMailservice);

// V1
outgingMailRouter.post(
  "/v1",
  UseAuth,
  multer.upload.single("evidence"),
  incomingMailcontroller.createMail.bind(incomingMailcontroller)
);
outgingMailRouter.get(
  "/v1",
  UseAuth,
  incomingMailcontroller.mailList.bind(incomingMailcontroller)
);
outgingMailRouter.get(
  "/v1/:agenda",
  UseAuth,
  incomingMailcontroller.detail.bind(incomingMailcontroller)
);

// V2
outgingMailRouter.get(
  "/v2",
  incomingMailcontroller.mailList.bind(incomingMailcontroller)
);
outgingMailRouter.get(
  "/v1/:agenda",
  incomingMailcontroller.detail.bind(incomingMailcontroller)
);

export default outgingMailRouter;
