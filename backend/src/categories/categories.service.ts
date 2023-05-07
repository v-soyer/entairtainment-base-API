import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getAll(): Promise<Category[]> {
    return await this.categoriesRepository.findAll();
  }

  async getOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOneById(id);

    if (!category) {
      throw new NotFoundException('category not found');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesRepository.createByDto(createCategoryDto);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoriesRepository.updateByDto(
      id,
      updateCategoryDto,
    );

    if (!category) {
      throw new NotFoundException('category not found');
    }

    return category;
  }

  async remove(id: string): Promise<Category> {
    const category = await this.categoriesRepository.removeOneById(id);

    if (!category) {
      throw new NotFoundException('category not found');
    }

    return category;
  }
}
