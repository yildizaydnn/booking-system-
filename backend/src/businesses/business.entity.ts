import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';
import { Service } from '../services/service.entity.js';
import { WorkingHours } from '../working-hours/working-hours.entity.js';
import { Appointment } from '../appointments/appointment.entity.js';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'owner_id' })
  ownerId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.businesses)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Service, (service) => service.business)
  services: Service[];

  @OneToMany(() => WorkingHours, (wh) => wh.business)
  workingHours: WorkingHours[];

  @OneToMany(() => Appointment, (appointment) => appointment.business)
  appointments: Appointment[];
}
