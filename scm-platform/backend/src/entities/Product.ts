import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Organization } from "./Organization";
import { BOM } from "./BOM";
import { ProductDemand } from "./ProductDemand";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: 0 })
  qty!: number;

  @Column({ nullable: true })
  image_url!: string;

  @Column({ nullable: true })
  notes!: string;

  @Column({ nullable: true })
  design_files!: string;

  @Column({ nullable: true })
  warnings!: string;

  @ManyToOne(() => Organization, (org) => org.products, { onDelete: "CASCADE" })
  organization!: Organization;

  @OneToMany(() => BOM, (bom) => bom.product)
  bom_entries!: BOM[];

  @OneToMany(() => ProductDemand, (demand) => demand.product)
  demands!: ProductDemand[];
}
