import { Injectable, NotFoundException } from '@nestjs/common';
import { Base } from './base.entity';
import { BasesRepository } from './bases.repository';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';

@Injectable()
export class BasesService {
  constructor(private readonly basesRepository: BasesRepository) {}

  getAll(): Promise<Base[]> {
    return this.basesRepository.findAll();
  }

  getOne(id: string): Promise<Base> {
    const base = this.basesRepository.findOneById(id);

    if (!base) {
      throw new NotFoundException('Base not found');
    }

    return base;
  }

  create(createBaseDto: CreateBaseDto): Promise<Base> {
    return this.basesRepository.createByDto(createBaseDto);
  }

  update(id: string, updateBaseDto: UpdateBaseDto): Promise<Base> {
    const base = this.basesRepository.updateByDto(id, updateBaseDto);

    if (!base) {
      throw new NotFoundException('Base not found');
    }

    return base;
  }
}
