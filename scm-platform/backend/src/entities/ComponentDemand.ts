import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Component } from "./Component";

@Entity()
export class ComponentDemand {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Component, (component) => component.demands, {
    onDelete: "CASCADE",
  })
  component!: Component;

  @Column({ type: "int" })
  month!: number;

  @Column({ type: "int" })
  year!: number;

  @Column({ type: "int" })
  qty!: number;

  @Column({ type: "boolean" })
  is_forecast!: boolean;
}
