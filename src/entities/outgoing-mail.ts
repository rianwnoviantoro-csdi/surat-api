import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import Abstract from "./abstract";
import User from "./user";

export interface IOutgoingMail {
  id?: number;
  uuid?: string;
  agenda?: string;
  number?: string;
  regarding?: string;
  destination?: string;
  explanation?: string;
  evidence?: string;
  attachment?: string;
  year?: string;
  mailingDate?: Date;
  archiver?: User;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

@Entity("outgoing_mails")
export default class OutgoingMail extends Abstract<OutgoingMail> {
  @Column({ comment: "nomor agenda" })
  agenda: string;

  @Column({ comment: "nomor surat" })
  number: string;

  @Column({ nullable: true, comment: "perihal" })
  regarding: string;

  @Column({ nullable: true, name: "destination", comment: "tujuan" })
  destination: string;

  @Column({ nullable: true, comment: "keterangan" })
  explanation: string;

  @Column({ nullable: true, comment: "file" })
  evidence: string;

  @Column({ nullable: true, comment: "tahun" })
  year: string;

  @Column({ nullable: true, comment: "lampiran" })
  attachment: string;

  @Column({ nullable: true, name: "mailing_date", comment: "tanggal surat" })
  mailingDate: Date;

  @ManyToOne(() => User, (user) => user.mails)
  @JoinColumn({ name: "achiver", referencedColumnName: "uuid" })
  archiver: User;
}
