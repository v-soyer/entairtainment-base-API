import { Injectable, NotFoundException } from '@nestjs/common';
import { Base } from './base.entity';
import { BasesRepository } from './bases.repository';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasesService {
  constructor(
    private readonly basesRepository: BasesRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<any>> {
    const pages = await this.basesRepository.paginate(options);

    return new Pagination(
      await Promise.all(
        pages.items.map(async (item) => {
          const weather = await this.httpService.axiosRef.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${
              item.city
            }&units=metric&appid=${this.configService.get('WEATHER_API_KEY')}`,
          );
          item.weather = weather.data.weather[0].main;
          item.temperature = weather.data.main.temp;
          return item;
        }),
      ),
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
