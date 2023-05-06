import { Controller, Get, Logger } from '@nestjs/common';
import { BasesService } from './bases.service';
import { Base } from './base.entity';

@Controller('bases')
export class BasesController {
  constructor(private basesService: BasesService) {}

  private logger = new Logger('BusinessRules Controller');

  @Get()
  getAllArticles(): Promise<Base[]> {
    this.logger.verbose('[GET] /base route is processed');
    return this.basesService.getAllBases();
  }
}
