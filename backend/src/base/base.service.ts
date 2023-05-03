import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
  getAllBases(): string {
    return 'base test return';
  }
}
