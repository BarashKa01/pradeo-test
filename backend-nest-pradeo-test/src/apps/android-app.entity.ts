
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class AndroidApp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hash: string;

  @Column()
  name: string;

  @Column()
  comment: string;

  @Column()
  is_safe: boolean;

  @Column()
  is_verified: boolean;

  @ManyToOne(type => User, user => user.apps)
  @JoinColumn({ referencedColumnName: "id" })
  user: User;

}