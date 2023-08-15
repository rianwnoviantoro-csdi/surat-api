import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import Abstract from "@entities/abstract";
import Role from "@entities/role";

export interface IUser {
  id?: number;
  uuid?: string;
  name?: string;
  email?: string;
  password?: string;
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
}
