import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../User";
import { Organization } from "../Organization";

@Entity()
export class ScenarioModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // e.g., "High Demand Q3", "Supplier X Delay", "Alt BOM Simulation"

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "jsonb" })
  input_parameters!: object; // e.g., { demand_growth: 1.25, delay_days: 5 }

  @Column({ type: "jsonb", nullable: true })
  output_metrics!: object; // e.g., { stockouts: 3, cost_impact: 4200 }

  @Column({ default: "draft" })
  status!: string; // e.g., "draft", "simulated", "approved", "archived"

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  created_by!: User | null;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  organization!: Organization;

  @CreateDateColumn()
  created_at!: Date;
    updated_at: Date | undefined;
    output_data: any;
    input_data: any;
    user: User | undefined;
}
