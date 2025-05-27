import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { Component } from "./Component";

@Entity()
export class BOM {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, (product) => product.bom_entries, {
    onDelete: "CASCADE",
  })
  product!: Product;

  @ManyToOne(() => Component, (component) => component.bom_entries, {
    onDelete: "CASCADE",
  })
  component!: Component;

  @Column()
  required_qty!: number;
}
