import UserRepository from "../repositories/user";
import User from "../entities/user";
import ApiError from "../configs/api-error";

export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async profile(uuid: string): Promise<User> {
    const result = await this.userRepository.getUserByUUID(uuid);

    if (!result) throw new ApiError(404, "User not found.");

    delete result.password;
    return result;
  }
}
