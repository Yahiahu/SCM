import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Organization } from "./Organization";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password_hash!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column()
  role!: string;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    onDelete: "SET NULL",
  })
  organization!: Organization;
}
