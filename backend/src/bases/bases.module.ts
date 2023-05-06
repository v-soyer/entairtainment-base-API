import { Module } from '@nestjs/common';
import { BasesController } from './bases.controller';
import { BasesService } from './bases.service';
import { BasesRepository } from './bases.repository';
import { Base } from './base.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist';

@Module({
  imports: [TypeOrmModule.forFeature([Base])],
  controllers: [BasesController],
  providers: [BasesRepository, BasesService],
})
export class BasesModule {}
