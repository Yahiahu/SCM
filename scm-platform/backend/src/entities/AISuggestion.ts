import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class AISuggestion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string; // e.g., 'reorder_point', 'shipment_delay'

  @Column()
  target_id!: number; // ID of component or product (you may extend with polymorphic logic)

  @Column({ type: "text", nullable: true })
  suggested_value!: string;

  @Column({ type: "float", nullable: true })
  confidence_score!: number;

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  triggered_by!: User | null;
}
