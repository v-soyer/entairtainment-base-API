import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesRepository {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
  ) {}

  async findAll(): Promise<Activity[]> {
    return await this.activitiesRepository.find();
  }

  async findOneById(id: string): Promise<Activity> {
    return await this.activitiesRepository.findOneBy({
      id: id,
    });
  }

  public async findOneByName(name: string): Promise<Activity> {
    return await this.activitiesRepository.findOneBy({
      name: name,
    });
  }

  async createByDto(createActivityDto: CreateActivityDto): Promise<Activity> {
    const { name } = createActivityDto;

    const base = this.activitiesRepository.create({
      name,
    });

    try {
      await this.activitiesRepository.save(base);
    } catch (error) {
      // 23505 is error code for duplicate
      if (error.code === '23505') {
        throw new ConflictException('This activity already exist');
      }
      throw new InternalServerErrorException();
    }
    return base;
  }

  async updateByDto(
    id: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    const found = await this.findOneById(id);

    if (found) {
      const { name } = updateActivityDto;

      found.name = name;
      await this.activitiesRepository.save(found);
    }

    return found;
  }

  async removeOneById(id: string): Promise<Activity> {
    const found = await this.findOneById(id);

    if (found) {
      await this.activitiesRepository.delete(found.id);
    }

    return found;
  }
}
