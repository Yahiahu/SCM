import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Component } from "./Component";
import { SupplierQuote } from "./SupplierQuote";
import { PurchaseOrder } from "./PurchaseOrder";
import { SupplierScore } from "./new/SupplierScorecard";

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "float", nullable: true })
  rating!: number;

  @Column({ nullable: true })
  contact_email!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ type: "float", nullable: true })
  historical_ontime_rate!: number;

  @Column({ type: "float", nullable: true })
  avg_unit_cost!: number;

  @Column({ type: "int", nullable: true })
  last_response_time!: number;

  @Column({ default: false })
  preferred!: boolean;

  @OneToMany(() => Component, (component) => component.supplier)
  components!: Component[];

  @OneToMany(() => SupplierQuote, (quote) => quote.supplier)
  quotes!: SupplierQuote[];

  @OneToMany(() => PurchaseOrder, (po) => po.supplier)
  purchase_orders!: PurchaseOrder[];

  @OneToMany(() => SupplierScore, (score) => score.supplier)
  scores!: SupplierScore[];
  rfqs: any;
}



