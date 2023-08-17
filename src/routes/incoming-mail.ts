import { Router } from "express";

import IncomingMailController from "@controllers/incoming-mail";
import UseAuth from "@middlewares/auth";
import IncomingMailRepository from "@repositories/incoming-mail";
import UserRepository from "@repositories/user";
import IncomingMailService from "@services/incoming-mail";
import multer from "@utils/multer";
import DispositionController from "@controllers/disposition";
import DispositionService from "@services/disposition";
import DispositionRepository from "@repositories/disposition";

const incomingMailRouter: Router = Router();

const incomingMailRepository = new IncomingMailRepository();
const userRepository = new UserRepository();
const incomingMailservice = new IncomingMailService(
  incomingMailRepository,
  userRepository
);
const incomingMailcontroller = new IncomingMailController(incomingMailservice);

const dispositionRepository = new DispositionRepository();
const dispositionService = new DispositionService(
  dispositionRepository,
  userRepository,
  incomingMailRepository
);
const dispositionController = new DispositionController(dispositionService);

// V1
incomingMailRouter.post(
  "/v1",
  UseAuth,
  multer.upload.single("evidence"),
  incomingMailcontroller.createMail.bind(incomingMailcontroller)
);
incomingMailRouter.get(
  "/v1",
  UseAuth,
  incomingMailcontroller.mailList.bind(incomingMailcontroller)
);
//
incomingMailRouter.post(
  "/v1/:mail/disposition",
  UseAuth,
  multer.upload.single("evidence"),
  dispositionController.createDIsposition.bind(dispositionController)
);
incomingMailRouter.get(
  "/v1/:mail/disposition",
  UseAuth,
  dispositionController.dispositionList.bind(dispositionController)
);

// V2
incomingMailRouter.get(
  "/v2",
  incomingMailcontroller.mailList.bind(incomingMailcontroller)
);
incomingMailRouter.get(
  "/v2/:mail/disposition",
  dispositionController.dispositionList.bind(dispositionController)
);

export default incomingMailRouter;
