// src/entities/new/ReturnOrder.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { PurchaseOrder } from "../PurchaseOrder";
import { ReturnOrderItem } from "./ReturnOrderItem";

@Entity()
export class ReturnOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => PurchaseOrder, (po) => po.return_orders, { eager: false })
  purchase_order!: PurchaseOrder;

  @Column()
  reason!: string;

  @OneToMany(() => ReturnOrderItem, (item) => item.return_order, {
    cascade: true,
  })
  items!: ReturnOrderItem[];

  @CreateDateColumn()
  created_at!: Date;
}
