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
export class InventoryValuation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Component, { onDelete: "CASCADE" })
  component!: Component;

  @ManyToOne(() => Warehouse, { onDelete: "CASCADE" })
  warehouse!: Warehouse;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "float" })
  unit_cost!: number;

  @Column({ type: "float" })
  total_value!: number;

  @Column()
  valuation_method!: string; // e.g., "FIFO", "LIFO", "Weighted Average"

  @CreateDateColumn()
  valuation_date!: Date;
}
