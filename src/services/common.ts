import IncomingMailRepository from "../repositories/incoming-mail";
import OutgoingMailRepository from "../repositories/outgoing-mail";
import UserRepository from "../repositories/user";
import WarrantRepository from "../repositories/warrant";

export default class CommonService {
  constructor(
    private readonly incomingMailRepository: IncomingMailRepository,
    private readonly outgoingMailRepository: OutgoingMailRepository,
    private readonly warrantRepository: WarrantRepository,
    private readonly userRepository: UserRepository
  ) {}

  async countMail(): Promise<any> {
    const countIncomingMail = await this.incomingMailRepository.count();
    const countOutgoingMail = await this.outgoingMailRepository.count();
    const countWarrant = await this.warrantRepository.count();

    return {
      total: countIncomingMail + countOutgoingMail + countWarrant,
      incomingMail: countIncomingMail,
      outgoingMail: countOutgoingMail,
      warrant: countWarrant,
    };
  }
}
