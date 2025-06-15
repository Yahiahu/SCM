import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Supplier } from "../Supplier";

@Entity()
export class SupplierPerformance {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.performances, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "supplier_id" })
  supplier!: Supplier;

  @Column({ type: "date" })
  month!: string; // YYYY-MM-DD format, use first of month (e.g. "2024-05-01")

  @Column({ type: "float" })
  on_time_delivery_rate!: number; // e.g. 0.93 → 93%

  @Column({ type: "float" })
  quality_rating!: number; // e.g. 0.97 → 97%
}
