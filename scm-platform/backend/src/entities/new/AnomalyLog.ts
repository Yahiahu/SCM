import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../User";

@Entity()
export class AnomalyLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  entity_type!: string; // e.g., "PurchaseOrder", "Inventory", "ComponentDemand"

  @Column()
  entity_id!: number;

  @Column({ type: "text" })
  description!: string; // Details of the anomaly

  @Column({ type: "float", nullable: true })
  severity_score!: number; // Optional, if your AI model assigns scores

  @Column({ nullable: true })
  detected_by!: string; // e.g., "AI", "manual", "rule-engine"

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  reviewer!: User | null; // Optional: who acknowledged/reviewed it
}
