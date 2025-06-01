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
export class Goal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // e.g., "On-Time Delivery Rate", "Inventory Turnover"

  @Column()
  kpi_metric!: string; // e.g., "on_time_delivery", "avg_inventory_turnover"

  @Column({ type: "float" })
  target_value!: number;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ nullable: true })
  unit!: string; // e.g., "%", "days", "units/month"

  @Column({ type: "date", nullable: true })
  due_date!: Date;

  @Column({ default: true })
  is_active!: boolean;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  organization!: Organization;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  created_by!: User | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
