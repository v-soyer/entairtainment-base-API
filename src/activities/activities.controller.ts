import {
  Controller,
  Logger,
  Get,
  Post,
  Put,
  Delete,
  ValidationPipe,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('activities')
@ApiTags('Activities')
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  private logger = new Logger('BusinessRules Controller');

  @Get()
  @ApiOkResponse({
    type: [Activity],
  })
  getAllBases(): Promise<Activity[]> {
    this.logger.verbose(`[GET] /activities route is processed`);
    return this.activitiesService.getAll();
  }

  @Get('/:id')
  @ApiOkResponse({
    type: Activity,
  })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  getOneBase(@Param('id', ParseUUIDPipe) id: string): Promise<Activity> {
    this.logger.verbose(`[GET] /activities/${id} route is processed`);
    return this.activitiesService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Activity })
  @ApiUnauthorizedResponse({
    description: 'Must be authentified via an access token',
  })
  @ApiBadRequestResponse({
    description: "Your form body doesn't match the expected body",
  })
  createBase(
    @Body(ValidationPipe) createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    this.logger.verbose(`[POST] /activities route is processed`);
    return this.activitiesService.create(createActivityDto);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Activity })
  @ApiUnauthorizedResponse({
    description: 'Must be authentified via an access token',
  })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  @ApiBadRequestResponse({
    description: "Your form body doesn't match the expected body",
  })
  updateBase(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    this.logger.verbose(`[PUT] /activities/${id} route is processed`);
    return this.activitiesService.update(id, updateActivityDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: Activity })
  @ApiUnauthorizedResponse({
    description: 'Must be authentified via an access token',
  })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  deleteBase(@Param('id', ParseUUIDPipe) id: string): Promise<Activity> {
    this.logger.verbose(`[DELETE] /activities/${id} route is processed`);
    return this.activitiesService.remove(id);
  }
}
