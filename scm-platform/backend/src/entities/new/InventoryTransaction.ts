import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Component } from "../Component";
import { Warehouse } from "../Warehouse";
import { User } from "../User";

@Entity()
export class InventoryTransaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Component, { onDelete: "CASCADE" })
  component!: Component;

  @ManyToOne(() => Warehouse, { onDelete: "CASCADE" })
  warehouse!: Warehouse;

  @Column()
  type!: string; // e.g., "add", "remove", "adjustment", "transfer_in", "transfer_out", "audit_correction"

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "text", nullable: true })
  reference!: string; // Optional: PO ID, audit ID, transfer ID, etc.

  @Column({ type: "text", nullable: true })
  notes!: string;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  performed_by!: User | null;

  @CreateDateColumn()
  timestamp!: Date;
}
