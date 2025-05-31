import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { PurchaseOrder } from "./PurchaseOrder";
import { MessageAttachment } from "./MessageAttachment";
import { POConversationThread } from "./POConversationThread";

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

  @ManyToOne(() => POConversationThread, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "threadId" })
  thread!: POConversationThread | null;

  @Column({ nullable: true })
  threadId!: number | null;

  @Column("text")
  message_body!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @OneToMany(() => MessageAttachment, (att) => att.message)
  attachments!: MessageAttachment[];
}
