import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingHours } from './working-hours.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([WorkingHours])],
  exports: [TypeOrmModule],
})
export class WorkingHoursModule {}
