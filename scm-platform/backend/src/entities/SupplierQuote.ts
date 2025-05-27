import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Supplier } from "./Supplier";
import { Component } from "./Component";

@Entity()
export class SupplierQuote {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.quotes, {
    onDelete: "CASCADE",
  })
  supplier!: Supplier;

  @ManyToOne(() => Component, { onDelete: "CASCADE" })
  component!: Component;

  @Column({ type: "float" })
  price_per_unit!: number;

  @Column()
  currency!: string;

  @Column({ type: "date" })
  valid_until!: Date;

  @Column({ type: "int" })
  lead_time_days!: number;
}
