import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

import Abstract from "@entities/abstract";
import Permission from "@entities/permission";
import User from "@entities/user";

export interface IRole {
  id?: number;
  uuid?: string;
  name?: string;
  created_at?: Date;
  updated_at?: Date;
}

@Entity("roles")
export default class Role extends Abstract<Role> {
  @Column()
  name?: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission)
  @JoinTable({
    name: "role_permissions",
    joinColumn: {
      name: "role",
      referencedColumnName: "uuid",
    },
    inverseJoinColumn: {
      name: "permission",
      referencedColumnName: "uuid",
    },
  })
  permissions: Permission[];
}
