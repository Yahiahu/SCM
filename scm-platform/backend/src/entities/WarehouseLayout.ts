import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Warehouse } from "./Warehouse";

@Entity()
export class WarehouseLayout {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.layout_versions, {
    onDelete: "CASCADE",
  })
  warehouse!: Warehouse;

  @Column({ nullable: true })
  layout_image_url!: string;

  @Column({ type: "jsonb", nullable: true })
  occupancy_json!: object;

  @Column({ type: "float", default: 0 })
  percent_occupied!: number;
}
