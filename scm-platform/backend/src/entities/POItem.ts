import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { PurchaseOrder } from "./PurchaseOrder";
import { Component } from "./Component";

@Entity()
export class POItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => PurchaseOrder, (po) => po.items, { onDelete: "CASCADE" })
  po!: PurchaseOrder;

  @ManyToOne(() => Component, (component) => component.po_items, {
    onDelete: "CASCADE",
  })
  component!: Component;

  @Column({ type: "int" })
  ordered_qty!: number;

  @Column({ type: "int", default: 0 })
  received_qty!: number;

  @Column({ type: "float" })
  unit_cost!: number;
}
