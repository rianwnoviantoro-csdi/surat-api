import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import Abstract from "./abstract";
import User from "./user";

export interface IWarrant {
  id?: number;
  uuid?: string;
  agenda?: string;
  number?: string;
  program?: string;
  place?: string;
  evidence?: string;
  year?: string;
  attachment?: string;
  startDate?: Date;
  endDate?: Date;
  mailingDate?: Date;
  employee?: string;
  dipa?: boolean;
  archiver?: User;
  created_at?: Date;
  updated_at?: Date;
}

@Entity("warrants")
export default class Warrant extends Abstract<Warrant> {
  @Column({ comment: "nomor agenda" })
  agenda: string;

  @Column({ comment: "nomor surat" })
  number: string;

  @Column({ nullable: true, comment: "acara" })
  program: string;

  @Column({ nullable: true, comment: "tempat" })
  place: string;

  @Column({ nullable: true, comment: "file" })
  evidence: string;

  @Column({ nullable: true, comment: "tahun" })
  year: string;

  @Column({ nullable: true, comment: "lampiran" })
  attachment: string;

  @Column({ nullable: true, name: "start_date", comment: "tanggal dimulai" })
  startDate: Date;

  @Column({ nullable: true, name: "end_date", comment: "tanggal berakhir" })
  endDate: Date;

  @Column({ nullable: true, name: "mailing_date", comment: "tanggal surat" })
  mailingDate: Date;

  @Column({ nullable: true, comment: "pegawai yang ditunjuk" })
  employee: string;

  @Column({ default: false, comment: "DIPA" })
  dipa: boolean;

  @ManyToOne(() => User, (user) => user.mails)
  @JoinColumn({ name: "achiver", referencedColumnName: "uuid" })
  archiver: User;
}
