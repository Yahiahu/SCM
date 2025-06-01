// src/entities/new/ReturnOrderItem.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Component } from "../Component";
import { ReturnOrder } from "./ReturnOrder";

@Entity()
export class ReturnOrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ReturnOrder, (ro) => ro.items, { onDelete: "CASCADE" })
  return_order!: ReturnOrder;

  @ManyToOne(() => Component)
  component!: Component;

  @Column()
  qty!: number;

  @Column()
  reason!: string;
}
