import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Following {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.following, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  Following: User;

  @ManyToOne(() => User, (user) => user.follower, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  Follower: User;
}
