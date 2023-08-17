import { Trait } from "@entities/disposition";
import IncomingMail from "@entities/incoming-mail";
import User from "@entities/user";

export class NewDispositionDto {
  objective?: string;
  content?: string;
  trait?: Trait;
  evidence?: string;
  notation?: string;
  mail?: IncomingMail;
  deadline?: Date;
  archiver?: User;
}
