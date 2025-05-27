import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { PurchaseOrder } from "./PurchaseOrder";
import { MessageAttachment } from "./MessageAttachment";

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  sender!: User;

  @ManyToOne(() => User, { nullable: true })
  receiver!: User | null;

  @ManyToOne(() => PurchaseOrder, { nullable: true })
  po!: PurchaseOrder | null;

  @Column("text")
  message_body!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @OneToMany(() => MessageAttachment, (att) => att.message)
  attachments!: MessageAttachment[];
}
