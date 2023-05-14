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

@Controller('activities')
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  private logger = new Logger('BusinessRules Controller');

  @Get()
  getAllBases(): Promise<Activity[]> {
    this.logger.verbose(`[GET] /activities route is processed`);
    return this.activitiesService.getAll();
  }

  @Get('/:id')
  getOneBase(@Param('id', ParseUUIDPipe) id: string): Promise<Activity> {
    this.logger.verbose(`[GET] /activities/${id} route is processed`);
    return this.activitiesService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createBase(
    @Body(ValidationPipe) createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    this.logger.verbose(`[POST] /activities route is processed`);
    return this.activitiesService.create(createActivityDto);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  updateBase(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    this.logger.verbose(`[PUT] /activities/${id} route is processed`);
    return this.activitiesService.update(id, updateActivityDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteBase(@Param('id', ParseUUIDPipe) id: string): Promise<Activity> {
    this.logger.verbose(`[DELETE] /activities/${id} route is processed`);
    return this.activitiesService.remove(id);
  }
}
