import { Injectable, NotFoundException } from '@nestjs/common';
import { Base } from './base.entity';
import { BasesRepository } from './bases.repository';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Like } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class BasesService {
  constructor(
    private readonly basesRepository: BasesRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  createPaginationRoute(
    route: string,
    queriesKey: string[],
    queriesValue: string[],
  ): string {
    let queryParam = '';

    for (let i = 0; i < queriesKey.length; i++) {
      if (queriesValue[i]) {
        queryParam += '&' + queriesKey[i] + '=' + queriesValue[i];
      }
    }
    return route + '?' + queryParam;
  }

  createFindOptions(searchField, activity): any {
    const findOptions: any = { relations: {} };

    if (activity && searchField) {
      findOptions.where = [];
      findOptions.relations.activities = true;
      findOptions.where.push({ activities: { name: activity } });
    } else if (activity) {
      findOptions.where = { activities: { name: activity } };
      findOptions.relations.activities = true;
    }

    if (searchField) {
      findOptions.where = [];
      findOptions.where.push({ name: Like(`%${searchField}%`) });
      findOptions.where.push({ description: Like(`%${searchField}%`) });
    }

    return findOptions;
  }

  async addWeatherInfo(item: any): Promise<any> {
    const weather = await this.httpService.axiosRef.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${
        item.city
      }&units=metric&appid=${this.configService.get('WEATHER_API_KEY')}`,
    );
    item.weather = weather.data.weather[0].main;
    item.temperature = weather.data.main.temp;
    return item;
  }

  async getAllWithFilters(
    page: number,
    limit: number,
    searchField: string,
    activity: string,
  ): Promise<Pagination<any>> {
    const findOptions = this.createFindOptions(searchField, activity);

    const pages = await this.basesRepository.paginateAllFilters(
      {
        page,
        limit,
        route: this.createPaginationRoute(
          '/bases',
          ['search', 'activity'],
          [searchField, activity],
        ),
      },
      findOptions,
    );

    return new Pagination(
      await Promise.all(pages.items.map((item) => this.addWeatherInfo(item))),
      pages.meta,
      pages.links,
    );
  }

  async getOne(id: string): Promise<any> {
    const base: any = await this.basesRepository.findOneById(id);

    if (!base) {
      throw new NotFoundException('Base not found');
    }

    const weather = await this.httpService.axiosRef.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${
        base.city
      }&units=metric&appid=${this.configService.get('WEATHER_API_KEY')}`,
    );
    base.weather = weather.data.weather[0].main;
    base.temperature = weather.data.main.temp;

    return base;
  }

  async create(createBaseDto: CreateBaseDto, user: User): Promise<Base> {
    return await this.basesRepository.createByDto(createBaseDto, user.username);
  }

  async update(id: string, updateBaseDto: UpdateBaseDto): Promise<Base> {
    const base = await this.basesRepository.updateByDto(id, updateBaseDto);

    if (!base) {
      throw new NotFoundException('Base not found');
    }

    return base;
  }

  async remove(id: string): Promise<Base> {
    const base = await this.basesRepository.removeOneById(id);

    if (!base) {
      throw new NotFoundException('Base not found');
    }

    return base;
  }
}
