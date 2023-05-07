import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async findOneById(id: string): Promise<Category> {
    return await this.categoriesRepository.findOneBy({
      id: id,
    });
  }

  async createByDto(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name } = createCategoryDto;

    const base = this.categoriesRepository.create({
      name,
    });

    await this.categoriesRepository.save(base);
    return base;
  }

  async updateByDto(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const found = await this.findOneById(id);

    if (found) {
      const { name } = updateCategoryDto;

      found.name = name;
      await this.categoriesRepository.save(found);
    }

    return found;
  }

  async removeOneById(id: string): Promise<Category> {
    const found = await this.findOneById(id);

    if (found) {
      await this.categoriesRepository.delete(found.id);
    }

    return found;
  }
}
