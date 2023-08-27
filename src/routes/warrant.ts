import { Router } from "express";

import WarrantController from "../controllers/warrant";
import UseAuth from "../middlewares/auth";
import WarrantRepository from "../repositories/warrant";
import UserRepository from "../repositories/user";
import WarrantService from "../services/warrant";
import multer from "../utils/multer";

const warrantRouter: Router = Router();

const warrantRepository = new WarrantRepository();
const userRepository = new UserRepository();
const service = new WarrantService(warrantRepository, userRepository);
const controller = new WarrantController(service);

// V1
warrantRouter.post(
  "/v1",
  UseAuth,
  multer.upload.single("evidence"),
  controller.createMail.bind(controller)
);
warrantRouter.get("/v1", UseAuth, controller.mailList.bind(controller));
warrantRouter.get("/v1/:agenda", UseAuth, controller.detail.bind(controller));
warrantRouter.put(
  "/v1/:agenda",
  UseAuth,
  multer.upload.single("evidence"),
  controller.update.bind(controller)
);
warrantRouter.delete(
  "/v1/:agenda/soft",
  UseAuth,
  controller.softDelete.bind(controller)
);
warrantRouter.delete(
  "/v1/:agenda/hard",
  UseAuth,
  controller.delete.bind(controller)
);
warrantRouter.get(
  "/v1/:agenda/restore",
  UseAuth,
  controller.restore.bind(controller)
);

export default warrantRouter;
