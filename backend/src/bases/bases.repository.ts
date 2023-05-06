import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Base } from './base.entity';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';

@Injectable()
export class BasesRepository {
  constructor(
    @InjectRepository(Base)
    private readonly basesRepository: Repository<Base>,
  ) {}

  async findAll(): Promise<Base[]> {
    return await this.basesRepository.find();
  }

  async findOneById(id: string): Promise<Base> {
    return await this.basesRepository.findOneBy({
      id: id,
    });
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

  async updateByDto(id: string, updateBaseDto: UpdateBaseDto): Promise<Base> {
    const found = await this.findOneById(id);

    if (found) {
      const { name, description, location, link, activities } = updateBaseDto;

      found.name = name;
      found.description = description;
      found.location = location;
      found.link = link;
      found.activities = activities;
      await this.basesRepository.save(found);
    }

    return found;
  }
}
