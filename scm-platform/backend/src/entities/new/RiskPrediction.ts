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
  entity_type!: string;

  @Column()
  entity_id!: number;

  @Column()
  risk_type!: string;

  @Column({ type: "float" })
  risk_score!: number;

  @Column({ type: "text", nullable: true })
  rationale!: string;

  @Column({ nullable: true })
  predicted_by!: string;

  @CreateDateColumn()
  predicted_at!: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  reviewed_by!: User | null;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  user!: User | null;
  type: any;
  target_entity: any;
  target_id: any;
  score: any;
  description: any;
}

