import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Following } from "./Following";
import { Reply } from "./Reply";
import { Like } from "./Like";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  photo_profile: string;

  @Column({ nullable: true })
  bio: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Following, (following) => following.Following)
  following: Following[];

  @OneToMany(() => Following, (follower) => follower.Follower)
  Follower: Following[];

  @OneToMany(() => Reply, (reply) => reply.user)
  reply: Reply[];

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];
}
