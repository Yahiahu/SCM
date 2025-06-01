import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Supplier } from "./Supplier";
import { BOM } from "./BOM";
import { POItem } from "./POItem";
import { ComponentDemand } from "./ComponentDemand";

@Entity()
export class Component {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  num!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  notes!: string;

  @Column({ nullable: true })
  image_url!: string;

  @Column({ nullable: true })
  supplier_part_number!: string;

  @ManyToOne(() => Supplier, { nullable: true, onDelete: "SET NULL" })
  supplier!: Supplier | null;

  @OneToMany(() => BOM, (bom) => bom.component)
  bom_entries!: BOM[];

  @OneToMany(() => POItem, (poItem) => poItem.component)
  po_items!: POItem[];

  @OneToMany(() => ComponentDemand, (demand) => demand.component)
  demands!: ComponentDemand[];
}
