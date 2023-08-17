import { Response } from "express";
import { ValidationError } from "joi";

import ApiError from "@configs/api-error";
import { NewDispositionDto } from "@dtos/disposition";
import { RequestWithUser } from "@middlewares/auth";
import DispositionService from "@services/disposition";
import { createDispositionSchema } from "@validators/disposition";

export default class DispositionController {
  constructor(private readonly dispositionService: DispositionService) {}

  async createDIsposition(req: RequestWithUser, res: Response) {
    try {
      const archiverUUID = req.user?.uuid as string;
      const mailUUID = req.params.mail as string;
      const body: NewDispositionDto = req.body;

      let evidence = null;

      if (req.file) {
        evidence = req.file;
      }

      await createDispositionSchema.validateAsync(body, {
        abortEarly: false,
      });

      return res.success(
        await this.dispositionService.createDisposition(
          archiverUUID,
          mailUUID,
          body,
          evidence
        )
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

  async dispositionList(req: RequestWithUser, res: Response) {
    try {
      const mailAgenda = req.params.mail as string;

      return res.success(
        await this.dispositionService.dispositionList(mailAgenda)
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
