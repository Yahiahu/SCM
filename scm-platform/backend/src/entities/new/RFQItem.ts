// src/entities/new/RFQItem.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Component } from "../Component";
import { RFQ } from "./RFQ";

@Entity()
export class RFQItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => RFQ, (rfq) => rfq.items, { onDelete: "CASCADE" })
  rfq!: RFQ;

  @ManyToOne(() => Component)
  component!: Component;

  @Column()
  qty!: number;
}
