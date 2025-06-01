import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../User";

@Entity()
export class RiskPrediction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  entity_type!: string; // e.g., "Supplier", "PurchaseOrder", "Component", "Product"

  @Column()
  entity_id!: number;

  @Column()
  risk_type!: string; // e.g., "late_shipment", "supplier_failure", "demand_spike"

  @Column({ type: "float" })
  risk_score!: number; // 0–1 probability or score

  @Column({ type: "text", nullable: true })
  rationale!: string; // Model explanation or notes

  @Column({ nullable: true })
  predicted_by!: string; // e.g., "AI_model_v2", "manual"

  @CreateDateColumn()
  predicted_at!: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  reviewed_by!: User | null;
    type: any;
    target_entity: any;
    target_id: any;
    score: any;
    description: any;
    user: User | undefined;
}
