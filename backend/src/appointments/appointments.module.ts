import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  exports: [TypeOrmModule],
})
export class AppointmentsModule {}
