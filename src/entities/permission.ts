import { Column, Entity, ManyToMany, OneToMany } from "typeorm";

import Abstract from "@entities/abstract";
import Role from "@entities/role";

export interface IPermission {
  id?: number;
  uuid?: string;
  name?: string;
  created_at?: Date;
  updated_at?: Date;
}

@Entity("permissions")
export default class Permission extends Abstract<Permission> {
  @Column()
  name: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
