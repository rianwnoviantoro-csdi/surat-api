import { FindManyOptions, IsNull, Not, getRepository } from "typeorm";
import { v4 } from "uuid";

import OutgoingMail from "../entities/outgoing-mail";
import { NewMailDto } from "../dto/outgoing-mail";

export default class OutgoingMailRepository {
  private repository = getRepository(OutgoingMail);

  async getMailByUUID(
    uuid: string,
    active: boolean = true
  ): Promise<OutgoingMail | null> {
    const existingMail = await this.repository.findOne({
      where: { uuid, is_active: active },
      relations: { archiver: true },
    });

    return existingMail;
  }

  async getMailByAgenda(
    agenda: string,
    active: boolean = true
  ): Promise<OutgoingMail | null> {
    const existingMail = await this.repository.findOne({
      where: { agenda, is_active: active },
      relations: { archiver: true },
    });

    return existingMail;
  }

  async getLastAgenda(): Promise<OutgoingMail | null> {
    const lastRecord = await this.repository.findOne({
      select: { agenda: true },
      where: { agenda: Not(IsNull()) },
      order: {
        created_at: "DESC",
      },
    });

    return lastRecord;
  }

  async find(): Promise<OutgoingMail[]> {
    return await this.repository.find();
  }

  async paginate(options: FindManyOptions): Promise<any> {
    return await this.repository.findAndCount(options);
  }

  async createMail(mail: NewMailDto): Promise<OutgoingMail> {
    const newMail = { ...mail, uuid: v4() };
    return await this.repository.save(newMail);
  }

  async updateMail(
    existingMail: OutgoingMail,
    partialMail: NewMailDto
  ): Promise<OutgoingMail> {
    const updatedMail = { ...existingMail, ...partialMail };
    return await this.repository.save(updatedMail);
  }

  async softDelete(mail: OutgoingMail): Promise<OutgoingMail> {
    const updatedMail = { ...mail, is_active: false };

    return await this.repository.save(updatedMail);
  }

  async restore(mail: OutgoingMail): Promise<OutgoingMail> {
    const updatedMail = { ...mail, is_active: true };

    return await this.repository.save(updatedMail);
  }

  async deleteMail(uuid: string): Promise<boolean> {
    const result = await this.repository.delete(uuid);

    return result.affected === 1;
  }
}
