import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../User";
import { Organization } from "../Organization";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string; // e.g., "Review PO #34", "Follow up with Supplier X"

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column()
  related_entity_type!: string; // e.g., "PurchaseOrder", "RFQ", "Alert"

  @Column({ nullable: true })
  related_entity_id!: number;

  @Column({ default: "open" })
  status!: string; // e.g., "open", "in_progress", "completed", "cancelled"

  @Column({ type: "date", nullable: true })
  due_date!: Date;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  assigned_to!: User | null;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  created_by!: User | null;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  organization!: Organization;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
