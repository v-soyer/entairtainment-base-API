import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Base } from './base.entity';

@Injectable()
export class BasesRepository {
  constructor(
    @InjectRepository(Base)
    private readonly basesRepository: Repository<Base>,
  ) {}

  async findAll(): Promise<Base[]> {
    return this.basesRepository.find();
  }
}
