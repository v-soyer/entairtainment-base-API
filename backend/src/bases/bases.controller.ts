import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { BasesService } from './bases.service';
import { Base } from './base.entity';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('bases')
export class BasesController {
  constructor(private basesService: BasesService) {}

  private logger = new Logger('BusinessRules Controller');

  @Get()
  getAllBases(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit = 2,
  ): Promise<Pagination<Base>> {
    this.logger.verbose(
      `[GET] /bases?page=${page}&limit=${limit} route is processed`,
    );
    return this.basesService.getAll(page, limit, '/bases');
  }

  @Get('/:id')
  getOneBase(@Param('id', ParseUUIDPipe) id: string): Promise<Base> {
    this.logger.verbose(`[GET] /bases/${id} route is processed`);
    return this.basesService.getOne(id);
  }

  @Post()
  createBase(
    @Body(ValidationPipe) createBaseDto: CreateBaseDto,
  ): Promise<Base> {
    this.logger.verbose(`[POST] /bases route is processed`);
    return this.basesService.create(createBaseDto);
  }

  @Put('/:id')
  updateBase(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateBaseDto: UpdateBaseDto,
  ): Promise<Base> {
    this.logger.verbose(`[PUT] /bases/${id} route is processed`);
    return this.basesService.update(id, updateBaseDto);
  }

  @Delete('/:id')
  deleteBase(@Param('id', ParseUUIDPipe) id: string): Promise<Base> {
    this.logger.verbose(`[DELETE] /bases/${id} route is processed`);
    return this.basesService.remove(id);
  }
}
