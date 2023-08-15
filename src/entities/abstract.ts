import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export default class Abstract<T> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, unique: true })
  uuid: string;

  @Column({ name: "is_active", nullable: false, default: true })
  is_active: boolean;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  @BeforeInsert()
  updateDates() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
