import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Warehouse } from "./Warehouse";

@Entity()
export class MonthlyStock {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.stock_records, {
    onDelete: "CASCADE",
  })
  warehouse!: Warehouse;

  @Column({ type: "int" })
  month!: number;

  @Column({ type: "int" })
  year!: number;

  @Column({ type: "float", default: 0 })
  percent_occupied!: number;
}
