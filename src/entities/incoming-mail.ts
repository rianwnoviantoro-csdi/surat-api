import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";

import Abstract from "@entities/abstract";
import User from "@entities/user";
import Disposition from "@entities/disposition";

export interface IIncomingMail {
  id?: number;
  uuid?: string;
  agenda?: string;
  number?: string;
  origin?: string;
  regarding?: string;
  followUp?: string;
  explanation?: string;
  evidence?: string;
  attachment?: string;
  recipient?: string;
  mailingDate?: Date;
  receivedDate?: Date;
  archiver?: User;
  disposition?: Disposition[];
  created_at?: Date;
  updated_at?: Date;
}

@Entity("incoming_mails")
export default class IncomingMail extends Abstract<IncomingMail> {
  @Column({ comment: "nomor agenda" })
  agenda: string;

  @Column({ comment: "nomor surat" })
  number: string;

  @Column({ nullable: true, comment: "asal" })
  origin: string;

  @Column({ nullable: true, comment: "perihal" })
  regarding: string;

  @Column({ nullable: true, name: "follow_up", comment: "tindak lanjut" })
  followUp: string;

  @Column({ nullable: true, comment: "keterangan" })
  explanation: string;

  @Column({ nullable: true, comment: "file" })
  evidence: string;

  @Column({ nullable: true, comment: "lampiran" })
  attachment: string;

  @Column({ nullable: true, comment: "penerima" })
  recipient: string;

  @Column({ nullable: true, name: "mailing_date", comment: "tanggal surat" })
  mailingDate: Date;

  @OneToMany(() => Disposition, (disposition) => disposition.mail)
  dispositions: Disposition[];

  @Column({
    nullable: true,
    name: "received_date",
    comment: "tanggal diterima",
  })
  receivedDate: Date;

  @ManyToOne(() => User, (user) => user.mails)
  @JoinColumn({ name: "achiver", referencedColumnName: "uuid" })
  archiver: User;
}
