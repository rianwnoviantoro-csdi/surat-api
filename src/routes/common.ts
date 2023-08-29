import { Router } from "express";

import WarrantController from "../controllers/warrant";
import UseAuth from "../middlewares/auth";
import WarrantRepository from "../repositories/warrant";
import UserRepository from "../repositories/user";
import WarrantService from "../services/warrant";
import multer from "../utils/multer";
import CommonController from "../controllers/common";
import CommonService from "../services/common";
import IncomingMailRepository from "../repositories/incoming-mail";
import OutgoingMailRepository from "../repositories/outgoing-mail";

const commonRouter: Router = Router();

const incomingMailRepository = new IncomingMailRepository();
const outgoingMailRepository = new OutgoingMailRepository();
const warrantRepository = new WarrantRepository();
const userRepository = new UserRepository();
const service = new CommonService(
  incomingMailRepository,
  outgoingMailRepository,
  warrantRepository,
  userRepository
);
const controller = new CommonController(service);

commonRouter.get(
  "/v1/count-mail",
  UseAuth,
  controller.countMail.bind(controller)
);

export default commonRouter;
