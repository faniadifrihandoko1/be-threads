import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Thread } from "./Thread";
import { User } from "./User";

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Thread, (thread) => thread.reply, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  thread: Thread;

  @ManyToOne(() => User, (user) => user.reply, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;
}
