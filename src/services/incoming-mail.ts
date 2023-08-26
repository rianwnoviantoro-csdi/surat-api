import { Between, FindManyOptions, ILike } from "typeorm";

import ApiError from "../configs/api-error";
import {
  MailsResponse,
  NewMailDto,
  PaginationOptions,
} from "../dto/incoming-mail";
import IncomingMail from "../entities/incoming-mail";
import IncomingMailRepository from "../repositories/incoming-mail";
import UserRepository from "../repositories/user";
import GenerateAgenda from "../utils/agenda";
import { uploadToS3 } from "../utils/s3";

export default class IncomingMailService {
  constructor(
    private readonly incomingMailRepository: IncomingMailRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createMail(
    userUUID: string,
    body: NewMailDto,
    evidence: any
  ): Promise<IncomingMail | []> {
    const existingUser = await this.userRepository.getUserByUUID(userUUID);

    if (!existingUser) throw new ApiError(404, "Account not found.");

    delete existingUser.password;

    let agenda = "0000001";

    const lastAgenda = await this.incomingMailRepository.getLastAgenda();

    if (lastAgenda) {
      agenda = await GenerateAgenda(lastAgenda.agenda);
    }

    if (evidence) {
      const document = await uploadToS3(
        `incoming-mails/${evidence.originalname}`,
        evidence.buffer
      );

      body.evidence = document;
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
      active,
    } = options;

    const skip = (pageNumber - 1) * pageSize;

    const findOptions: FindManyOptions = {
      select: {
        uuid: true,
        agenda: true,
        number: true,
        origin: true,
        regarding: true,
        recipient: true,
        mailingDate: true,
        receivedDate: true,
        is_active: true,
      },
      skip,
      take: pageSize,
      order: { [sortingField]: sortOrder || "ASC" },
      where: {
        is_active: active,
        agenda: ILike(`%${agenda}%`),
      },
    };

    if (startDate && endDate) {
      findOptions.where = {
        mailingDate: Between(startDate, endDate),
      };
    }

    const [mails, total] = await this.incomingMailRepository.paginate(
      findOptions
    );

    if (mails.length === 0) throw new ApiError(404, "Mail not found.");

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

  async detail(agenda: string): Promise<IncomingMail> {
    const result = await this.checkExistMail(agenda);

    return result;
  }

  async update(
    agenda: string,
    userUUID: string,
    body: NewMailDto,
    evidence: any
  ): Promise<IncomingMail> {
    const mail = await this.checkExistMail(agenda);

    if (mail.archiver.uuid !== userUUID) {
      throw new ApiError(403, "Unauthorized.");
    }

    if (evidence) {
      const document = await uploadToS3(
        `incoming-mails/${evidence.originalname}`,
        evidence.buffer
      );

      body.evidence = document;
    }

    return await this.incomingMailRepository.updateMail(mail, body);
  }

  async softDelete(agenda: string): Promise<IncomingMail> {
    const mail = await this.checkExistMail(agenda);

    return await this.incomingMailRepository.softDelete(mail);
  }

  async restore(agenda: string): Promise<IncomingMail> {
    const mail = await this.checkExistMail(agenda, false);

    return await this.incomingMailRepository.restore(mail);
  }

  async deleteMail(agenda: string): Promise<boolean> {
    const mail = await this.checkExistMail(agenda, false);

    return await this.incomingMailRepository.deleteMail(mail.agenda);
  }

  async checkExistMail(
    agenda: string,
    active: boolean = true
  ): Promise<IncomingMail> {
    const exist = await this.incomingMailRepository.getMailByAgenda(
      agenda,
      active
    );

    if (!exist) throw new ApiError(404, "Mail not found.");

    delete exist.archiver.password;

    return exist;
  }
}
