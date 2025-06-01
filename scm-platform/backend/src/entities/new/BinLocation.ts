import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Warehouse } from "../Warehouse";
import { WarehouseInventory } from "../WarehouseInventory";

@Entity()
export class BinLocation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  label!: string; // e.g., "A1", "Shelf-3B", etc.

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  zone!: string; // Optional: e.g., "Cold Storage", "Inbound Dock"

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.bin_locations, {
    onDelete: "CASCADE",
  })
  warehouse!: Warehouse;

  @OneToMany(() => WarehouseInventory, (inventory) => inventory.bin_location)
  inventory_items!: WarehouseInventory[];
}
