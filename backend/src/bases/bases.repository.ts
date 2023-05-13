import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Base } from './base.entity';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';
import { ActivitiesRepository } from 'src/activities/activities.repository';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class BasesRepository {
  constructor(
    @InjectRepository(Base)
    private readonly basesRepository: Repository<Base>,

    @Inject(ActivitiesRepository)
    private readonly activitiesRepository: ActivitiesRepository,
  ) {}

  async paginateAll(options: IPaginationOptions): Promise<Pagination<any>> {
    return paginate(this.basesRepository, options);
  }

  async paginateAllFilters(
    options: IPaginationOptions,
    findOptions: any,
  ): Promise<Pagination<any>> {
    return paginate<Base>(this.basesRepository, options, findOptions);
  }

  async findAll(): Promise<Base[]> {
    const bases = await this.basesRepository
      .createQueryBuilder('base')
      .leftJoinAndSelect('base.activities', 'activity')
      .getMany();
    return bases;
  }

  async findByActivity(category: string): Promise<Base[]> {
    const bases = await this.basesRepository
      .createQueryBuilder('base')
      .leftJoinAndSelect('base.activities', 'activity')
      .where('activity.name =:name', { name: category })
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
    const { name, description, location, city, link, activities } =
      createBaseDto;
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
      city,
      link,
      activities: baseActivities,
    });

    await this.basesRepository.save(base);
    return base;
  }

  async updateByDto(id: string, updateBaseDto: UpdateBaseDto): Promise<Base> {
    const found = await this.findOneById(id);

    if (found) {
      const { name, description, location, city, link, activities } =
        updateBaseDto;
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
      found.city = city;
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

  // async paginateByFilters(
  //   options: IPaginationOptions,
  //   searchField: string,
  // ): Promise<Pagination<Base>> {
  //   return paginate<Base>(this.basesRepository, options, {
  //     where: [
  //       { name: Like(`%${searchField}%`) },
  //       { description: Like(`%${searchField}%`) },
  //     ],
  //   });
  // }

  // async paginateByActivity(
  //   options: IPaginationOptions,
  //   activity: string,
  // ): Promise<Pagination<Base>> {
  //   return paginate<Base>(this.basesRepository, options, {
  //     relations: {
  //       activities: true,
  //     },
  //     where: {
  //       activities: {
  //         name: activity,
  //       },
  //     },
  //   });
  // }
}
