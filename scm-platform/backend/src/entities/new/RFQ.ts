// src/entities/new/RFQ.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Supplier } from "../Supplier";
import { RFQItem } from "./RFQItem";

@Entity()
export class RFQ {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.rfqs)
  supplier!: Supplier;

  @Column({ nullable: true })
  notes!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => RFQItem, (item) => item.rfq, {
    cascade: true,
  })
  items!: RFQItem[];
}
