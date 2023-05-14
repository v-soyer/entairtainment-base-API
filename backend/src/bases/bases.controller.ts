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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BasesService } from './bases.service';
import { Base } from './base.entity';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { GetUser } from 'src/users/get-user.decorator';

@Controller('bases')
export class BasesController {
  constructor(private basesService: BasesService) {}

  private logger = new Logger('BusinessRules Controller');

  @Get()
  getAllBasesWithFilters(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit = 2,
    @Query('search') searchField: string,
    @Query('activity') activity: string,
  ): Promise<Pagination<any>> {
    this.logger.verbose(
      `[GET] /bases?page=${page}&limit=${limit} route is processed`,
    );
    return this.basesService.getAllWithFilters(
      page,
      limit,
      searchField,
      activity,
    );
  }

  @Get('/:id')
  getOneBase(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    this.logger.verbose(`[GET] /bases/${id} route is processed`);
    return this.basesService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createBase(
    @Body(ValidationPipe) createBaseDto: CreateBaseDto,
    @GetUser() user: User,
  ): Promise<Base> {
    this.logger.verbose(`[POST] /bases route is processed`);
    return this.basesService.create(createBaseDto, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  updateBase(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateBaseDto: UpdateBaseDto,
    @GetUser() user: User,
  ): Promise<Base> {
    this.logger.verbose(`[PUT] /bases/${id} route is processed`);
    return this.basesService.update(id, updateBaseDto, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteBase(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<Base> {
    this.logger.verbose(`[DELETE] /bases/${id} route is processed`);
    return this.basesService.remove(id, user);
  }
}
