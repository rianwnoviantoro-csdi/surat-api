import { FindManyOptions, IsNull, Not, getRepository } from "typeorm";
import { v4 } from "uuid";

import Warrant from "../entities/warrant";
import { NewMailDto } from "../dto/warrant";

export default class WarrantRepository {
  private repository = getRepository(Warrant);

  async getMailByUUID(uuid: string): Promise<Warrant | null> {
    const existingMail = await this.repository.findOne({
      where: { uuid },
      relations: { archiver: true },
    });

    return existingMail;
  }

  async getMailByAgenda(agenda: string): Promise<Warrant | null> {
    const existingMail = await this.repository.findOne({
      where: { agenda },
      relations: { archiver: true },
    });

    return existingMail;
  }

  async getLastAgenda(): Promise<Warrant | null> {
    const lastRecord = await this.repository.findOne({
      select: { agenda: true },
      where: { agenda: Not(IsNull()) },
      order: {
        created_at: "DESC",
      },
    });

    return lastRecord;
  }

  async find(): Promise<Warrant[]> {
    return await this.repository.find();
  }

  async paginate(options: FindManyOptions): Promise<any> {
    return await this.repository.findAndCount(options);
  }

  async createMail(mail: NewMailDto): Promise<Warrant> {
    const newMail = { ...mail, uuid: v4() };
    return await this.repository.save(newMail);
  }

  async updateMail(
    existingMail: Warrant,
    partialMail: NewMailDto
  ): Promise<Warrant> {
    const updatedMail = { ...existingMail, ...partialMail };
    return await this.repository.save(updatedMail);
  }

  async deleteMail(uuid: string): Promise<boolean> {
    const result = await this.repository.delete(uuid);

    return result.affected === 1;
  }
}
