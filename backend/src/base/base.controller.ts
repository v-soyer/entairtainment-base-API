import { Controller, Get } from '@nestjs/common';
import { BaseService } from './base.service';

@Controller('base')
export class BaseController {
  constructor(private baseService: BaseService) {}

  @Get()
  getAllArticles(): string {
    return this.baseService.getAllBases();
  }
}
