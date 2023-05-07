import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Base } from './base.entity';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';
import { ActivitiesRepository } from 'src/activities/activities.repository';
import { Activity } from 'src/activities/activity.entity';

@Injectable()
export class BasesRepository {
  constructor(
    @InjectRepository(Base)
    private readonly basesRepository: Repository<Base>,

    @Inject(ActivitiesRepository)
    private readonly activitiesRepository: ActivitiesRepository,
  ) {}

  async findAll(): Promise<Base[]> {
    const bases = await this.basesRepository
      .createQueryBuilder('base')
      .leftJoinAndSelect('base.activities', 'activity')
      .getMany();
    return bases;
  }

  async findOneById(id: string): Promise<Base> {
    const bases = await this.basesRepository
      .createQueryBuilder('base')
      .leftJoinAndSelect('base.activities', 'activity')
      .where('base.id =:id', { id: id })
      .getMany();
    return bases[0];
  }

  async createByDto(createBaseDto: CreateBaseDto): Promise<Base> {
    const { name, description, location, link, activities } = createBaseDto;
    const activitiesList = activities.split(',');
    const baseActivities = [];

    for (let i = 0; i < activitiesList.length; i++) {
      const act = await this.activitiesRepository.findOneByName(
        activitiesList[i],
      );

      if (!act) {
        throw new NotFoundException("At least one activity doesn't exist");
      }
      baseActivities.push(act);
    }

    const base = this.basesRepository.create({
      name,
      description,
      location,
      link,
      activities: baseActivities,
    });

    await this.basesRepository.save(base);
    return base;
  }

  async updateByDto(id: string, updateBaseDto: UpdateBaseDto): Promise<Base> {
    const found = await this.findOneById(id);

    if (found) {
      const { name, description, location, link, activities } = updateBaseDto;
      const activitiesList = activities.split(',');
      const baseActivities = [];

      for (let i = 0; i < activitiesList.length; i++) {
        const act = await this.activitiesRepository.findOneByName(
          activitiesList[i],
        );
        if (!act) {
          throw new NotFoundException("At least one activity doesn't exist");
        }
        baseActivities.push(act);
      }

      found.name = name;
      found.description = description;
      found.location = location;
      found.link = link;
      found.activities = baseActivities;
      await this.basesRepository.save(found);
    }

    return found;
  }

  async removeOneById(id: string): Promise<Base> {
    const found = await this.findOneById(id);

    if (found) {
      await this.basesRepository.delete(found.id);
    }

    return found;
  }
}
