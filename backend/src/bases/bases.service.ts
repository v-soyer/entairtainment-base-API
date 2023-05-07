import { Injectable, NotFoundException } from '@nestjs/common';
import { Base } from './base.entity';
import { BasesRepository } from './bases.repository';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasesService {
  constructor(
    private readonly basesRepository: BasesRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(
    page: number,
    limit: number,
    route: string,
  ): Promise<Pagination<any>> {
    const pages = await this.basesRepository.paginate({
      page,
      limit,
      route: route,
    });

    for (let i = 0; i < pages.items.length; i++) {
      const weather = await this.httpService.axiosRef.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${
          pages.items[i].city
        }&units=metric&appid=${this.configService.get('WEATHER_API_KEY')}`,
      );
      pages.items[i].weather = weather.data.weather[0].main;
      pages.items[i].temperature = weather.data.main.temp;
    }

    return pages;
  }

  async getOne(id: string): Promise<Base> {
    const base = await this.basesRepository.findOneById(id);

    if (!base) {
      throw new NotFoundException('Base not found');
    }

    return base;
  }

  async create(createBaseDto: CreateBaseDto): Promise<Base> {
    return await this.basesRepository.createByDto(createBaseDto);
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
