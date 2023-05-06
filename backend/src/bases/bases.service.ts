import { Injectable, NotFoundException } from '@nestjs/common';
import { Base } from './base.entity';
import { BasesRepository } from './bases.repository';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';

@Injectable()
export class BasesService {
  constructor(private readonly basesRepository: BasesRepository) {}

  async getAll(): Promise<Base[]> {
    return await this.basesRepository.findAll();
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
