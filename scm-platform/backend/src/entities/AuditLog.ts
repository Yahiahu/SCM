import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  entity_type!: string; // e.g., 'Product', 'PO', etc.

  @Column()
  entity_id!: number;

  @Column()
  action_type!: string; // e.g., 'create', 'update', 'delete'

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  actor!: User | null;

  @CreateDateColumn()
  timestamp!: Date;

  @Column({ type: "text" })
  change_summary!: string; // JSON or text description
}
