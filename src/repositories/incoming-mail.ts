import { FindManyOptions, IsNull, Not, getRepository } from "typeorm";
import { v4 } from "uuid";

import IncomingMail from "@entities/incoming-mail";
import { NewMailDto } from "@dtos/incoming-mail";

export default class IncomingMailRepository {
  private repository = getRepository(IncomingMail);

  async getMailByUUID(uuid: string): Promise<IncomingMail | null> {
    const existingMail = await this.repository.findOne({ where: { uuid } });

    return existingMail;
  }

  async getMailByAgenda(agenda: string): Promise<IncomingMail | null> {
    const existingMail = await this.repository.findOne({ where: { agenda } });

    return existingMail;
  }

  async getLastAgenda(): Promise<IncomingMail | null> {
    const lastRecord = await this.repository.findOne({
      select: { agenda: true },
      where: { agenda: Not(IsNull()) },
      order: {
        created_at: "DESC",
      },
    });

    return lastRecord;
  }

  async find(): Promise<IncomingMail[]> {
    return await this.repository.find();
  }

  async paginate(options: FindManyOptions): Promise<any> {
    return await this.repository.findAndCount(options);
  }

  async createMail(mail: NewMailDto): Promise<IncomingMail> {
    const newMail = { ...mail, uuid: v4() };
    return await this.repository.save(newMail);
  }

  async updateMail(
    existingMail: IncomingMail,
    partialMail: NewMailDto
  ): Promise<IncomingMail> {
    const updatedMail = { ...existingMail, ...partialMail };
    return await this.repository.save(updatedMail);
  }

  async deleteMail(uuid: string): Promise<boolean> {
    const result = await this.repository.delete(uuid);

    return result.affected === 1;
  }
}
