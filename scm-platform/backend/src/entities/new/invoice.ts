// src/entities/Invoice.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Payment } from "./payments";

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  invoiceNumber!: string;

  @Column()
  customerName!: string;

  @Column("date")
  issueDate!: string;

  @Column("date")
  dueDate!: string;

  @Column("float")
  totalAmount!: number;

  @Column("float")
  amountPaid!: number;

  @Column("float")
  balanceDue!: number;

  @Column()
  status!:
    | "Draft"
    | "Sent"
    | "Paid"
    | "Partially Paid"
    | "Overdue"
    | "Cancelled";

  @Column()
  currency!: string;

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments!: Payment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
