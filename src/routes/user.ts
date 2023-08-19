import UserController from "@controllers/user";
import UseAuth from "@middlewares/auth";
import UserRepository from "@repositories/user";
import UserService from "@services/user";
import { Router } from "express";

const userRouter: Router = Router();

const repository = new UserRepository();
const service = new UserService(repository);
const controller = new UserController(service);

userRouter.post("/v1/mine", UseAuth, controller.getProfile.bind(controller));

export default userRouter;
