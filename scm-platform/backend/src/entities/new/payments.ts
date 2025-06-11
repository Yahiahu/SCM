
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Invoice } from "./invoice";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  paymentId!: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.payments, { nullable: true })
  invoice!: Invoice;

  @Column("timestamp")
  paymentDate!: Date;

  @Column("float")
  amount!: number;

  @Column()
  type!: "Incoming" | "Outgoing";

  @Column()
  method!: "Bank Transfer" | "Credit Card" | "Cheque" | "Cash";

  @Column()
  status!: "Completed" | "Pending" | "Failed" | "Refunded";

  @Column()
  description!: string;

  @Column()
  currency!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
