import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Component } from "../Component";
import { PurchaseOrder } from "../PurchaseOrder";
import { ShippingInfo } from "../ShippingInfo";

@Entity()
export class LandedCost {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Component, { onDelete: "CASCADE" })
  component!: Component;

  @ManyToOne(() => PurchaseOrder, { onDelete: "CASCADE" })
  purchase_order!: PurchaseOrder;

  @ManyToOne(() => ShippingInfo, { nullable: true, onDelete: "SET NULL" })
  shipment!: ShippingInfo | null;

  @Column({ type: "float" })
  base_unit_cost!: number;

  @Column({ type: "float", default: 0 })
  freight_cost!: number;

  @Column({ type: "float", default: 0 })
  duty_cost!: number;

  @Column({ type: "float", default: 0 })
  handling_cost!: number;

  @Column({ type: "float" })
  total_unit_cost!: number; // base + allocated extras

  @Column({ type: "text", nullable: true })
  notes!: string;

  @CreateDateColumn()
  recorded_at!: Date;
}
