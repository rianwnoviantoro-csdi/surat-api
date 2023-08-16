import "reflect-metadata";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import "@configs/database";
import { env } from "@configs/env";
import { ErrorHandler } from "@middlewares/error-handler";
import { ResponseHandler } from "@middlewares/response-handler";
import authRouter from "@routes/auth";
import incomingMailRouter from "@routes/incoming-mail";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(ErrorHandler);
app.use(ResponseHandler);

app.use("/auth", authRouter);
app.use("/incoming-mail", incomingMailRouter);

app.listen(env.port, () => {
  console.log(`Serving on port ${env.port}`);
});
