import UserRepository from "@repositories/user";
import User from "@entities/user";

export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async profile(uuid: string): Promise<User> {
    return await this.userRepository.getUserByUUID(uuid);
  }
}
