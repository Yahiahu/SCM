import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../User";

@Entity()
export class AutomationRule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // e.g., "Auto Reorder for Resistors"

  @Column()
  trigger_event!: string; // e.g., "inventory_below_min", "po_delay"

  @Column()
  target_entity_type!: string; // e.g., "Component", "Product"

  @Column()
  target_entity_id!: number;

  @Column({ type: "text" })
  action_definition!: string; // e.g., JSON string: { action: "createPO", qty: 100 }

  @Column({ default: true })
  is_active!: boolean;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  created_by!: User | null;

  @CreateDateColumn()
  created_at!: Date;
}
