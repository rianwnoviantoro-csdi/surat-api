import { ValidationError } from "joi";
import { Response } from "express";

import { NewMailDto, PaginationOptions } from "../dto/warrant";
import { RequestWithUser } from "../middlewares/auth";
import WarrantService from "../services/warrant";
import { createWarrantSchema } from "../validators/warrant";
import ApiError from "../configs/api-error";

export default class OutgoingMailController {
  constructor(private readonly warrantService: WarrantService) {}

  async createMail(req: RequestWithUser, res: Response) {
    try {
      const archiverUUID = req.user?.uuid as string;
      const body: NewMailDto = req.body;

      let evidence = null;

      if (req.file) {
        evidence = req.file;
      }

      await createWarrantSchema.validateAsync(body, {
        abortEarly: false,
      });

      return res.success(
        await this.warrantService.createMail(archiverUUID, body, evidence)
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
        agenda = "",
        active = "true",
      } = req.query;

      let isActive = true;

      active === "true" ? (isActive = true) : (isActive = false);

      const options: PaginationOptions = {
        pageNumber: Number(page),
        pageSize: Number(pageSize),
        sortingField: sort as string, // Change this to your desired sorting field
        sortOrder: order.toString().toUpperCase() === "ASC" ? "ASC" : "DESC", // Change this to 'ASC' or omit for default
        startDate: startDate as string,
        endDate: endDate as string,
        agenda: agenda as string,
        active: isActive,
      };

      return res.success(await this.warrantService.mailList(options));
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
      return res.success(await this.warrantService.detail(req.params.agenda));
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

  async update(req: RequestWithUser, res: Response) {
    try {
      const agenda = req.params.agenda;
      const archiverUUID = req.user?.uuid as string;
      const body: NewMailDto = req.body;

      let evidence = null;

      if (req.file) {
        evidence = req.file;
      }

      await createWarrantSchema.validateAsync(body, {
        abortEarly: false,
      });

      return res.success(
        await this.warrantService.update(agenda, archiverUUID, body, evidence)
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

  async softDelete(req: RequestWithUser, res: Response) {
    try {
      return res.success(
        await this.warrantService.softDelete(req.params.agenda)
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

  async restore(req: RequestWithUser, res: Response) {
    try {
      return res.success(await this.warrantService.restore(req.params.agenda));
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

  async delete(req: RequestWithUser, res: Response) {
    try {
      return res.success(
        await this.warrantService.deleteMail(req.params.agenda)
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
}
