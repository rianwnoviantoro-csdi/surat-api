import { Between, FindManyOptions } from "typeorm";

import ApiError from "@configs/api-error";
import {
  MailsResponse,
  NewMailDto,
  PaginationOptions,
} from "@dtos/incoming-mail";
import IncomingMail from "@entities/incoming-mail";
import IncomingMailRepository from "@repositories/incoming-mail";
import UserRepository from "@repositories/user";
import GenerateAgenda from "@utils/agenda";

export default class IncomingMailService {
  constructor(
    private readonly incomingMailRepository: IncomingMailRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createMail(userUUID: string, body: NewMailDto): Promise<IncomingMail> {
    const existingUser = await this.userRepository.getUserByUUID(userUUID);

    if (!existingUser) throw new ApiError(404, "Account not found.");

    let agenda = "0000001";

    const lastAgenda = await this.incomingMailRepository.getLastAgenda();

    if (lastAgenda) {
      agenda = await GenerateAgenda(lastAgenda.agenda);
    }

    const mail = {
      ...body,
      agenda: agenda,
      archiver: existingUser,
    };

    return await this.incomingMailRepository.createMail(mail);
  }

  async mailList(options: PaginationOptions): Promise<MailsResponse> {
    const {
      pageNumber,
      pageSize,
      sortingField,
      sortOrder,
      startDate,
      endDate,
      agenda,
    } = options;

    const skip = (pageNumber - 1) * pageSize;

    const findOptions: FindManyOptions = {
      select: {
        agenda: true,
        number: true,
        origin: true,
        regarding: true,
        mailingDate: true,
        receivedDate: true,
      },
      skip,
      take: pageSize,
      order: { [sortingField]: sortOrder || "ASC" },
      where: {},
    };

    if (startDate && endDate) {
      findOptions.where = {
        mailingDate: Between(startDate, endDate),
      };
    }

    if (agenda) {
      findOptions.where = {
        agenda: agenda,
      };
    }

    const [mails, total] = await this.incomingMailRepository.paginate(
      findOptions
    );

    const totalPages = Math.ceil(total / pageSize);

    const response: MailsResponse = {
      mails,
      pagination: {
        pageNumber,
        pageSize,
        totalPages,
        totalItems: total,
      },
    };

    return response;
  }
}
