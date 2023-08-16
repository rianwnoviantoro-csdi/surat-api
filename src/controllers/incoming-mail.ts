import { ValidationError } from "joi";
import { Response } from "express";

import { NewMailDto, PaginationOptions } from "@dtos/incoming-mail";
import { RequestWithUser } from "@middlewares/auth";
import IncomingMailService from "@services/incoming-mail";
import { createIncomingMailSchema } from "@validators/incoming-mail";
import ApiError from "@configs/api-error";

export default class IncomingMailController {
  constructor(private readonly incomingMailService: IncomingMailService) {}

  async createMail(req: RequestWithUser, res: Response) {
    try {
      const archiverUUID = req.user?.uuid as string;
      const body: NewMailDto = req.body;

      let evidence = null;

      if (req.file) {
        evidence = req.file;
      }

      await createIncomingMailSchema.validateAsync(body, {
        abortEarly: false,
      });

      const result = await this.incomingMailService.createMail(
        archiverUUID,
        body,
        evidence
      );

      return res.success(result);
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
      let { page, pageSize, sort, order, startDate, endDate, agenda } =
        req.query;

      const options: PaginationOptions = {
        pageNumber: Number(page),
        pageSize: Number(pageSize),
        sortingField: sort as string, // Change this to your desired sorting field
        sortOrder: order.toString().toUpperCase() === "ASC" ? "ASC" : "DESC", // Change this to 'ASC' or omit for default
        startDate: startDate as string,
        endDate: endDate as string,
        agenda: agenda as string,
      };

      const result = await this.incomingMailService.mailList(options);

      return res.success(result);
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
