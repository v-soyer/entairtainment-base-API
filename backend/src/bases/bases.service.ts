import { Injectable } from '@nestjs/common';
import { Base } from './base.entity';
import { BasesRepository } from './bases.repository';

@Injectable()
export class BasesService {
  constructor(private readonly basesRepository: BasesRepository) {}

  getAllBases(): Promise<Base[]> {
    return this.basesRepository.findAll();
  }
}
