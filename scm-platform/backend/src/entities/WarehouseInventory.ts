import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Warehouse } from "./Warehouse";
import { Component } from "./Component";

@Entity()
export class WarehouseInventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventory, {
    onDelete: "CASCADE",
  })
  warehouse!: Warehouse;

  @ManyToOne(() => Component, { onDelete: "CASCADE" })
  component!: Component;

  @Column({ type: "int", default: 0 })
  current_qty!: number;

  @Column({ type: "int", default: 0 })
  incoming_qty!: number;

  @Column({ type: "int", default: 0 })
  outgoing_qty!: number;
}
