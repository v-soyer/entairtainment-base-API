import { Module } from '@nestjs/common';
import { ActivityiesController } from './activities.controller';
import { ActivityiesService } from './activities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { ActivityiesRepository } from './activities.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityiesController],
  providers: [ActivityiesRepository, ActivityiesService],
})
export class ActivitiesModule {}
