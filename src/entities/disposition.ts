import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import Abstract from "./abstract";
import User from "./user";
import IncomingMail from "./incoming-mail";

export enum Trait {
  IMPORTANT = "penting",
  IMMEDIATELY = "segera",
  CONFIDENTIAL = "rahasia",
}

export interface IDisposition {
  id?: number;
  uuid?: string;
  objective?: string;
  content?: string;
  trait?: Trait;
  evidence?: string;
  notation?: string;
  mail?: IncomingMail;
  archiver?: User;
  deadline?: Date;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

@Entity("dispositions")
export default class Disposition extends Abstract<Disposition> {
  @Column({ nullable: true, comment: "tujuan" })
  objective: string;

  @Column({ nullable: true, comment: "isi disposisi", type: "text" })
  content: string;

  @Column({ nullable: true, comment: "sifat", type: "enum", enum: Trait })
  trait: Trait;

  @Column({ nullable: true, comment: "batas waktu" })
  deadline: Date;

  @Column({ nullable: true, comment: "catatan", type: "text" })
  notation: string;

  @ManyToOne(() => IncomingMail, (mail) => mail.dispositions)
  @JoinColumn({ name: "mail", referencedColumnName: "uuid" })
  mail: IncomingMail;

  @Column({ nullable: true, comment: "file" })
  evidence: string;

  @ManyToOne(() => User, (user) => user.mails)
  @JoinColumn({ name: "achiver", referencedColumnName: "uuid" })
  archiver: User;
}
