import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { PurchaseOrder } from "./PurchaseOrder";
import { User } from "./User";
import { ChatMessage } from "./ChatMessage";

@Entity()
export class POConversationThread {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => PurchaseOrder, { onDelete: "CASCADE" })
  po!: PurchaseOrder;

  @Column()
  title!: string;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  created_by!: User;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => ChatMessage, (msg) => msg.po)
  messages!: ChatMessage[];
}
