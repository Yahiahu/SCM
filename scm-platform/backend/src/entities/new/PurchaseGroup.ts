import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "../User";
import { PurchaseOrder } from "../PurchaseOrder";

@Entity()
export class PurchaseGroup {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // e.g., "May Electronics Order", "Q2 Bulk Buy"

  @Column({ nullable: true })
  notes!: string;

  @Column({ default: "draft" })
  status!: string; // e.g., "draft", "submitted", "completed"

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  created_by!: User | null;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => PurchaseOrder, (po) => po.purchase_group)
  purchase_orders!: PurchaseOrder[];
}
