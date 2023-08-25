import { Between, FindManyOptions, ILike } from "typeorm";

import ApiError from "../configs/api-error";
import {
  MailsResponse,
  NewMailDto,
  PaginationOptions,
} from "../dto/outgoing-mail";
import OutgoingMail from "../entities/outgoing-mail";
import OutgoingMailRepository from "../repositories/outgoing-mail";
import UserRepository from "../repositories/user";
import GenerateAgenda from "../utils/agenda";
import { uploadToS3 } from "../utils/s3";

export default class OutgoingMailService {
  constructor(
    private readonly outgoingMailRepository: OutgoingMailRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createMail(
    userUUID: string,
    body: NewMailDto,
    evidence: any
  ): Promise<OutgoingMail | []> {
    const existingUser = await this.userRepository.getUserByUUID(userUUID);

    if (!existingUser) throw new ApiError(404, "Account not found.");

    delete existingUser.password;

    let agenda = "0000001";

    const lastAgenda = await this.outgoingMailRepository.getLastAgenda();

    if (lastAgenda) {
      agenda = await GenerateAgenda(lastAgenda.agenda);
    }

    if (evidence) {
      const document = await uploadToS3(
        `outgoing-mails/${evidence.originalname}`,
        evidence.buffer
      );

      body.evidence = document;
    }

    const mail = {
      ...body,
      agenda: agenda,
      archiver: existingUser,
    };

    return await this.outgoingMailRepository.createMail(mail);
    // return [];
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
        uuid: true,
        agenda: true,
        number: true,
        regarding: true,
        destination: true,
        mailingDate: true,
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
        agenda: ILike(`%${agenda}%`),
      };
    }

    const [mails, total] = await this.outgoingMailRepository.paginate(
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

  async detail(agenda: string): Promise<OutgoingMail> {
    const result = await this.outgoingMailRepository.getMailByAgenda(agenda);

    delete result.archiver.password;

    return result;
  }
}
