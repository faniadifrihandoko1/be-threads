import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Reply } from "./Reply";
import { Like } from "./Like";
import { User } from "./User";

@Entity()
export class Thread {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Reply, (reply) => reply.thread, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  reply: Reply[];

  @OneToMany(() => Like, (like) => like.thread, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  like: Like[];

  @ManyToOne(() => User, (user) => user.thread, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;
}
