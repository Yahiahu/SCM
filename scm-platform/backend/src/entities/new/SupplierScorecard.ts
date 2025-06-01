import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Supplier } from "../Supplier";
import { User } from "../User";

@Entity()
export class SupplierScore {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.scores, {
    onDelete: "CASCADE",
  })
  supplier!: Supplier;

  @Column({ type: "float", nullable: true })
  on_time_delivery!: number; // e.g., 0.92 for 92%

  @Column({ type: "float", nullable: true })
  quality_rating!: number; // e.g., out of 5 or 10

  @Column({ type: "float", nullable: true })
  cost_competitiveness!: number;

  @Column({ type: "float", nullable: true })
  responsiveness!: number;

  @Column({ type: "float", nullable: true })
  overall_score!: number; // optional weighted average

  @Column({ type: "text", nullable: true })
  notes!: string;

  @CreateDateColumn()
  evaluated_at!: Date;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  evaluated_by!: User | null;
    date: Date | undefined;
    cost_score: any;
    quality_score: any;
}
