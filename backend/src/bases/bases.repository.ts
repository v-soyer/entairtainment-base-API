import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Base } from './base.entity';
import { CreateBaseDto } from './dto/create-base.dto';

@Injectable()
export class BasesRepository {
  constructor(
    @InjectRepository(Base)
    private readonly basesRepository: Repository<Base>,
  ) {}

  async findAll(): Promise<Base[]> {
    return await this.basesRepository.find();
  }

  async createByDto(createBaseDto: CreateBaseDto): Promise<Base> {
    const { name, description, location, link, activities } = createBaseDto;

    const base = this.basesRepository.create({
      name,
      description,
      location,
      link,
      activities,
    });

    await this.basesRepository.save(base);
    return base;
  }
}
