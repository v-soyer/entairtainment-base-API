import { Injectable, NotFoundException } from '@nestjs/common';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivitiesRepository } from './activities.repository';

@Injectable()
export class ActivitiesService {
  constructor(private readonly activitiesRepository: ActivitiesRepository) {}

  async getAll(): Promise<Activity[]> {
    return await this.activitiesRepository.findAll();
  }

  async getOne(id: string): Promise<Activity> {
    const activity = await this.activitiesRepository.findOneById(id);

    if (!activity) {
      throw new NotFoundException('activity not found');
    }

    return activity;
  }

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    return await this.activitiesRepository.createByDto(createActivityDto);
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.activitiesRepository.updateByDto(
      id,
      updateActivityDto,
    );

    if (!activity) {
      throw new NotFoundException('activity not found');
    }

    return activity;
  }

  async remove(id: string): Promise<Activity> {
    const activity = await this.activitiesRepository.removeOneById(id);

    if (!activity) {
      throw new NotFoundException('activity not found');
    }

    return activity;
  }
}
