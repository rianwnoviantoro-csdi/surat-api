import ApiError from "../configs/api-error";
import { NewDispositionDto } from "../dto/disposition";
import Disposition from "../entities/disposition";
import DispositionRepository from "../repositories/disposition";
import IncomingMailRepository from "../repositories/incoming-mail";
import UserRepository from "../repositories/user";
import { uploadToS3 } from "../utils/s3";

export default class DispositionService {
  constructor(
    private readonly dispositionRepository: DispositionRepository,
    private readonly userRepository: UserRepository,
    private readonly mailRepository: IncomingMailRepository
  ) {}

  async createDisposition(
    userUUID: string,
    mailAgenda: string,
    body: NewDispositionDto,
    evidence: any
  ): Promise<Disposition | []> {
    const existingUser = await this.userRepository.getUserByUUID(userUUID);

    if (!existingUser) throw new ApiError(404, "Account not found.");

    delete existingUser.password;

    const existingMail = await this.mailRepository.getMailByAgenda(mailAgenda);

    if (!existingMail) throw new ApiError(404, "Mail not found.");

    if (evidence) {
      const document = await uploadToS3(
        `incoming-mails/dispositions/${evidence.originalname}`,
        evidence.buffer
      );

      body.evidence = document;
    }

    const disposition = {
      ...body,
      archiver: existingUser,
      mail: existingMail,
    };

    return await this.dispositionRepository.createDisposition(disposition);
  }

  async dispositionList(mail: string): Promise<Disposition[] | []> {
    return await this.dispositionRepository.find(mail);
  }
}
