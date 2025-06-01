import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Organization } from "./Organization";
import { WarehouseInventory } from "./WarehouseInventory";
import { MonthlyStock } from "./MonthlyStock";
import { WarehouseLayout } from "./WarehouseLayout";
import { BinLocation } from "./new/BinLocation";

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  location!: string;

  @ManyToOne(() => Organization, (org) => org.warehouses, {
    onDelete: "CASCADE",
  })
  organization!: Organization;

  @OneToMany(() => WarehouseInventory, (inventory) => inventory.warehouse)
  inventory!: WarehouseInventory[];

  @OneToMany(() => MonthlyStock, (stock) => stock.warehouse)
  stock_records!: MonthlyStock[];

  @OneToMany(() => WarehouseLayout, (layout) => layout.warehouse)
  layout_versions!: WarehouseLayout[];

  @OneToMany(() => BinLocation, (bin) => bin.warehouse)
  bin_locations!: BinLocation[];

}

