
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AndroidApp } from '../apps/android-app.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @OneToMany(type => AndroidApp, androidApp => androidApp.user, { cascade: ['insert', 'update'] })
  apps: AndroidApp[];
}