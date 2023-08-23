import { getRepository } from "typeorm";

import Disposition from "../entities/disposition";
import { v4 } from "uuid";
import { NewDispositionDto } from "../dto/disposition";

export default class DispositionRepository {
  private repository = getRepository(Disposition);

  async getDispositionByUUID(uuid: string): Promise<Disposition | null> {
    const existingDisposition = await this.repository.findOne({
      where: { uuid },
    });

    return existingDisposition;
  }

  async find(mail: string): Promise<Disposition[]> {
    const result = await this.repository.find({
      where: { mail: { agenda: mail } },
    });

    return result;
  }

  async createDisposition(
    disposition: NewDispositionDto
  ): Promise<Disposition> {
    const newDisposition = { ...disposition, uuid: v4() };
    return await this.repository.save(newDisposition);
  }

  async updateDisposition(
    existingDisposition: Disposition,
    partialDisposition: NewDispositionDto
  ): Promise<Disposition> {
    const updatedDisposition = {
      ...existingDisposition,
      ...partialDisposition,
    };
    return await this.repository.save(updatedDisposition);
  }

  async deleteDisposition(uuid: string): Promise<boolean> {
    const result = await this.repository.delete(uuid);

    return result.affected === 1;
  }
}
