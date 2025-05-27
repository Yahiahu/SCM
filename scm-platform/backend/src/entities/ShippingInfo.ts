import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { PurchaseOrder } from "./PurchaseOrder";
import { Component } from "./Component";

@Entity()
export class ShippingInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => PurchaseOrder, (po) => po.shipments, { onDelete: "CASCADE" })
  po!: PurchaseOrder;

  @ManyToOne(() => Component, { onDelete: "SET NULL" })
  component!: Component;

  @Column({ type: "int" })
  qty!: number;

  @Column()
  origin!: string;

  @Column()
  destination!: string;

  @Column()
  carrier!: string;

  @Column({ nullable: true })
  tracking_number!: string;

  @Column({ type: "date", nullable: true })
  estimated_arrival!: Date;

  @Column()
  status!: string; // e.g., "in transit", "delayed", "delivered"

  @Column({ nullable: true })
  current_location!: string;
}
