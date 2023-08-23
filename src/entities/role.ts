import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

import Abstract from "./abstract";
import Permission from "./permission";
import User from "./user";

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
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission)
  @JoinTable({
    name: "role_permission",
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
