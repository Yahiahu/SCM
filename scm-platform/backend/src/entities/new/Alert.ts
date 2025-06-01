import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../User";

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string; // e.g., "inventory_low", "shipment_delay", "ai_suggestion"

  @Column({ type: "text" })
  message!: string;

  @Column({ default: false })
  is_read!: boolean;

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  user!: User | null; // Optional: tie to a user if personal, null if global
}
