import {
  Controller,
  Logger,
  Get,
  Post,
  Put,
  Delete,
  ValidationPipe,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  private logger = new Logger('BusinessRules Controller');

  @Get()
  getAllBases(): Promise<Category[]> {
    this.logger.verbose(`[GET] /categories route is processed`);
    return this.categoriesService.getAll();
  }

  @Get('/:id')
  getOneBase(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    this.logger.verbose(`[GET] /categories/${id} route is processed`);
    return this.categoriesService.getOne(id);
  }

  @Post()
  createBase(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    this.logger.verbose(`[POST] /categories route is processed`);
    return this.categoriesService.create(createCategoryDto);
  }

  @Put('/:id')
  updateBase(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    this.logger.verbose(`[PUT] /categories/${id} route is processed`);
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete('/:id')
  deleteBase(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    this.logger.verbose(`[DELETE] /categories/${id} route is processed`);
    return this.categoriesService.remove(id);
  }
}
