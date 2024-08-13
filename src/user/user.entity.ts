import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({default: 0})
  role: UserRoles;
}