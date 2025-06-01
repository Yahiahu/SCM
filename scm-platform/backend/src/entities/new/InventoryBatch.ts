import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Component } from "../Component";
import { Warehouse } from "../Warehouse";

@Entity()
export class InventoryBatch {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  batch_number!: string; // e.g., "B-20240601-R1"

  @ManyToOne(() => Component, { onDelete: "CASCADE" })
  component!: Component;

  @ManyToOne(() => Warehouse, { onDelete: "CASCADE" })
  warehouse!: Warehouse;

  @Column({ type: "int" })
  qty!: number;

  @Column({ type: "date", nullable: true })
  received_date!: Date;

  @Column({ type: "date", nullable: true })
  expiry_date!: Date;

  @Column({ nullable: true })
  supplier_lot_ref!: string; // Optional cross-ref to supplier-provided batch code

  @Column({ nullable: true })
  notes!: string;

  @CreateDateColumn()
  created_at!: Date;
}
