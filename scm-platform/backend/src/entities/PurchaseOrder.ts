import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Supplier } from "./Supplier";
import { User } from "./User";
import { POItem } from "./POItem";
import { ShippingInfo } from "./ShippingInfo";
import { PurchaseGroup } from "./new/PurchaseGroup";

@Entity()
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchase_orders, {
    onDelete: "SET NULL",
  })
  supplier!: Supplier;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  created_by!: User;

  @Column()
  status!: string; // draft, ordered, received, etc.

  @Column({ type: "date" })
  date_created!: Date;

  @Column({ type: "date", nullable: true })
  date_expected!: Date;

  @Column({ type: "date", nullable: true })
  date_received!: Date;

  @OneToMany(() => POItem, (item) => item.po)
  items!: POItem[];

  @OneToMany(() => ShippingInfo, (ship) => ship.po)
  shipments!: ShippingInfo[];

  @ManyToOne(() => PurchaseGroup, (group) => group.purchase_orders, {
    nullable: true,
    onDelete: "SET NULL",
  })
  purchase_group!: PurchaseGroup | null;
  return_orders: any;
    isCompleted: any;
    totalValue: number = 0;
}

