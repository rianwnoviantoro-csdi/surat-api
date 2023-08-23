import AuthController from "../controllers/auth";
import UserRepository from "../repositories/user";
import AuthService from "../services/auth";
import { Router } from "express";

const authRouter: Router = Router();

const repository = new UserRepository();
const service = new AuthService(repository);
const controller = new AuthController(service);

authRouter.post("/v1/login", controller.login.bind(controller));

export default authRouter;
