import { ValidationError } from "joi";
import { Response } from "express";

import { NewMailDto, PaginationOptions } from "../dto/outgoing-mail";
import { RequestWithUser } from "../middlewares/auth";
import OutgoingMailService from "../services/outgoing-mail";
import { createOutgingMailSchema } from "../validators/outgoing-mail";
import ApiError from "../configs/api-error";

export default class OutgoingMailController {
  constructor(private readonly outgingMailService: OutgoingMailService) {}

  async createMail(req: RequestWithUser, res: Response) {
    try {
      const archiverUUID = req.user?.uuid as string;
      const body: NewMailDto = req.body;

      let evidence = null;

      if (req.file) {
        evidence = req.file;
      }

      await createOutgingMailSchema.validateAsync(body, {
        abortEarly: false,
      });

      return res.success(
        await this.outgingMailService.createMail(archiverUUID, body, evidence)
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.error(error.status, error.message);
      } else if (error instanceof ValidationError) {
        const errorMessages = error.details.map((err) => err.message);
        res.error(400, errorMessages);
      } else {
        console.log(error);
        res.error(500, "Internal Server Error");
      }
    }
  }

  async mailList(req: RequestWithUser, res: Response) {
    try {
      let {
        page = 1,
        pageSize = 10,
        sort = "agenda",
        order = "asc",
        startDate,
        endDate,
        agenda,
      } = req.query;

      const options: PaginationOptions = {
        pageNumber: Number(page),
        pageSize: Number(pageSize),
        sortingField: sort as string, // Change this to your desired sorting field
        sortOrder: order.toString().toUpperCase() === "ASC" ? "ASC" : "DESC", // Change this to 'ASC' or omit for default
        startDate: startDate as string,
        endDate: endDate as string,
        agenda: agenda as string,
      };

      return res.success(await this.outgingMailService.mailList(options));
    } catch (error) {
      if (error instanceof ApiError) {
        res.error(error.status, error.message);
      } else if (error instanceof ValidationError) {
        const errorMessages = error.details.map((err) => err.message);
        res.error(400, errorMessages);
      } else {
        console.log(error.message);
        res.error(500, "Internal Server Error");
      }
    }
  }

  async detail(req: RequestWithUser, res: Response) {
    try {
      return res.success(
        await this.outgingMailService.detail(req.params.agenda)
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.error(error.status, error.message);
      } else if (error instanceof ValidationError) {
        const errorMessages = error.details.map((err) => err.message);
        res.error(400, errorMessages);
      } else {
        console.log(error.message);
        res.error(500, "Internal Server Error");
      }
    }
  }
}
