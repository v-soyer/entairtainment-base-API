import { Injectable } from '@nestjs/common';
import { Base } from './base.entity';
import { BasesRepository } from './bases.repository';
import { CreateBaseDto } from './dto/create-base.dto';

@Injectable()
export class BasesService {
  constructor(private readonly basesRepository: BasesRepository) {}

  getAll(): Promise<Base[]> {
    return this.basesRepository.findAll();
  }

  create(createBaseDto: CreateBaseDto): Promise<Base> {
    return this.basesRepository.createByDto(createBaseDto);
  }
}
