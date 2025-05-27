import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity()
export class ProductDemand {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, (product) => product.demands, {
    onDelete: "CASCADE",
  })
  product!: Product;

  @Column({ type: "int" })
  month!: number;

  @Column({ type: "int" })
  year!: number;

  @Column({ type: "int" })
  qty!: number;

  @Column({ type: "boolean" })
  is_forecast!: boolean;
}
