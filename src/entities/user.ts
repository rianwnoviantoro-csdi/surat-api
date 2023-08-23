import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import Abstract from "./abstract";
import Role from "./role";
import IncomingMail from "./incoming-mail";

export interface IUser {
  id?: number;
  uuid?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  mails?: IncomingMail[];
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

@Entity("users")
export default class User extends Abstract<User> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: "role", referencedColumnName: "uuid" })
  role: Role;

  @OneToMany(() => IncomingMail, (incomingMail) => incomingMail.archiver)
  mails: IncomingMail[];
}
