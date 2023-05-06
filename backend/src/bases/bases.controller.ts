import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { BasesService } from './bases.service';
import { Base } from './base.entity';
import { CreateBaseDto } from './dto/create-base.dto';

@Controller('bases')
export class BasesController {
  constructor(private basesService: BasesService) {}

  private logger = new Logger('BusinessRules Controller');

  @Get()
  getAllBases(): Promise<Base[]> {
    this.logger.verbose('[GET] /bases route is processed');
    return this.basesService.getAll();
  }

  @Post()
  createBases(@Body() createBaseDto: CreateBaseDto): Promise<Base> {
    this.logger.verbose('[POST] /bases route is processed');
    return this.basesService.create(createBaseDto);
  }
}
