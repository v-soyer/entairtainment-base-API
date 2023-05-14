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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('bases')
@ApiTags('Bases')
export class BasesController {
  constructor(private basesService: BasesService) {}

  private logger = new Logger('BusinessRules Controller');

  @Get()
  @ApiOkResponse({
    description:
      "A paginated list of Base Entity. Note: Fields 'temperature' and 'weather' are added for each base",
    type: [Base],
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'activity', required: false, type: String })
  getAllBasesWithFilters(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit = 2,
    @Query('search') searchField?: string,
    @Query('activity') activity?: string,
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
  @ApiOkResponse({
    description:
      "A paginated list of Base Entity. Note: Fields 'temperature' and 'weather' are added for each base",
    type: Base,
  })
  @ApiNotFoundResponse({ description: 'Base not found' })
  getOneBase(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    this.logger.verbose(`[GET] /bases/${id} route is processed`);
    return this.basesService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Base })
  @ApiUnauthorizedResponse({
    description: 'Must be authentified via an access token',
  })
  @ApiBadRequestResponse({
    description: "Your form body doesn't match the expected body",
  })
  createBase(
    @Body(ValidationPipe) createBaseDto: CreateBaseDto,
    @GetUser() user: User,
  ): Promise<Base> {
    this.logger.verbose(`[POST] /bases route is processed`);
    return this.basesService.create(createBaseDto, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Base })
  @ApiUnauthorizedResponse({
    description: 'Must be authentified via an access token',
  })
  @ApiNotFoundResponse({ description: 'Base not found' })
  @ApiForbiddenResponse({
    description: 'Not allow to Modify the base',
  })
  @ApiBadRequestResponse({
    description: "Your form body doesn't match the expected body",
  })
  updateBase(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateBaseDto: UpdateBaseDto,
    @GetUser() user: User,
  ): Promise<Base> {
    this.logger.verbose(`[PUT] /bases/${id} route is processed`);
    return this.basesService.update(id, updateBaseDto, user);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: Base })
  @ApiUnauthorizedResponse({
    description: 'Must be authentified via an access token',
  })
  @ApiNotFoundResponse({ description: 'Base not found' })
  @ApiForbiddenResponse({
    description: 'Not allow to Delete the base',
  })
  deleteBase(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<Base> {
    this.logger.verbose(`[DELETE] /bases/${id} route is processed`);
    return this.basesService.remove(id, user);
  }
}
