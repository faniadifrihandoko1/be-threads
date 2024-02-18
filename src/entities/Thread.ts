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

  @Column()
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Reply, (reply) => reply.thread)
  reply: Reply[];

  @OneToMany(() => Like, (like) => like.thread)
  like: Like[];

  @ManyToOne(() => User, (user) => user.thread)
  user: User;
}
