import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { Warehouse } from "./Warehouse";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => User, (user) => user.organization)
  users!: User[];

  @OneToMany(() => Product, (product) => product.organization)
  products!: Product[];

  @OneToMany(() => Warehouse, (warehouse) => warehouse.organization)
  warehouses!: Warehouse[];
}
