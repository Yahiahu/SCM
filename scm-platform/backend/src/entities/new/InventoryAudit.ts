import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Warehouse } from "../Warehouse";
import { Component } from "../Component";
import { User } from "../User";

@Entity()
export class InventoryAudit {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Warehouse, { onDelete: "CASCADE" })
  warehouse!: Warehouse;

  @ManyToOne(() => Component, { onDelete: "CASCADE" })
  component!: Component;

  @Column({ type: "int" })
  recorded_qty!: number;

  @Column({ type: "int" })
  counted_qty!: number;

  @Column({ type: "text", nullable: true })
  notes!: string;

  @CreateDateColumn()
  audit_date!: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  conducted_by!: User | null;
}
