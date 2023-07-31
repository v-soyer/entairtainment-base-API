import { ApiProperty } from '@nestjs/swagger';
import { Activity } from 'src/activities/activity.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Base {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  description: string;

  @Column()
  @ApiProperty()
  location: string;

  @Column()
  @ApiProperty()
  city: string;

  @Column()
  @ApiProperty()
  link: string;

  @Column()
  @ApiProperty()
  author: string;

  @ManyToMany(() => Activity, { eager: true })
  @JoinTable()
  @ApiProperty()
  activities: Activity[];

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  modifiedAt: Date;
}
