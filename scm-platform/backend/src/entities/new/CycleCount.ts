import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { Component } from "../Component";

@Entity()
export class CycleCount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  countId!: string;

  @Column()
  countDate!: Date;

  @ManyToOne(() => Component)
  component!: Component;

  @Column()
  systemQuantity!: number;

  @Column()
  countedQuantity!: number;

  @Column("float")
  accuracyPercentage!: number;

  @Column()
  status!: string;

  @Column()
  countedBy!: string;

  @UpdateDateColumn()
  lastUpdated!: Date;
}
