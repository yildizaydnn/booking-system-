import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DayOfWeek } from '../common/enums/index.js';
import { Business } from '../businesses/business.entity.js';

@Entity('working_hours')
export class WorkingHours {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'business_id' })
  businessId: string;

  @Column({ type: 'smallint', name: 'day_of_week' })
  dayOfWeek: DayOfWeek;

  @Column({ type: 'time', name: 'open_time' })
  openTime: string;

  @Column({ type: 'time', name: 'close_time' })
  closeTime: string;

  @Column({ type: 'boolean', name: 'is_closed', default: false })
  isClosed: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Business, (business) => business.workingHours)
  @JoinColumn({ name: 'business_id' })
  business: Business;
}
