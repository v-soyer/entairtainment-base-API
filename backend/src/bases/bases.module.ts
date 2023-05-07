import { Module } from '@nestjs/common';
import { BasesController } from './bases.controller';
import { BasesService } from './bases.service';
import { BasesRepository } from './bases.repository';
import { Base } from './base.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Activity } from 'src/activities/activity.entity';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  imports: [TypeOrmModule.forFeature([Base, Activity]), ActivitiesModule],
  controllers: [BasesController],
  providers: [BasesRepository, BasesService],
})
export class BasesModule {}
