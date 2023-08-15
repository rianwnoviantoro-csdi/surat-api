import { getRepository } from "typeorm";
import { v4 } from "uuid";

import { RegisterDto, UpdateUserDto } from "@dtos/user";
import User from "@entities/user";

export default class UserRepository {
  private repository = getRepository(User);

  async getUserByUUID(uuid: string): Promise<User | null> {
    const existingUser = await this.repository.findOne({ where: { uuid } });

    return existingUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const existingUser = await this.repository.findOne({ where: { email } });

    return existingUser;
  }

  async find(): Promise<User[]> {
    return await this.repository.find();
  }

  async createUser(user: RegisterDto): Promise<User> {
    const newUser = { ...user, uuid: v4() };
    return await this.repository.save(newUser);
  }

  async updateUser(
    existingUser: User,
    partialUser: UpdateUserDto
  ): Promise<User> {
    const updatedUser = { ...existingUser, ...partialUser };
    return await this.repository.save(updatedUser);
  }

  async deleteUser(uuid: string): Promise<boolean> {
    const result = await this.repository.delete(uuid);

    return result.affected === 1;
  }
}
