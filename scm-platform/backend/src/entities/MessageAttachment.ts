import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ChatMessage } from "./ChatMessage";

@Entity()
export class MessageAttachment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ChatMessage, (msg) => msg.attachments, {
    onDelete: "CASCADE",
  })
  message!: ChatMessage;

  @Column()
  file_url!: string;

  @Column()
  file_type!: string;
}
