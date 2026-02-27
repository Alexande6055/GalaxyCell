import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '../dto/category.dto';
import { UpdateCategoryDto } from '../dto/updatecategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }
  @Post('create')
  async create(@Body() categoryDto: CategoryDto) {
    return await this.categoryService.create(categoryDto);
  }

  @Patch('update/:id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() categoryDto: UpdateCategoryDto) {
    return await this.categoryService.update(id, categoryDto);
  }

  @Delete('delete/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoryService.softDelete(id);
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoryService.getById(id);
  }

  @Get()
  async getAll() {
    return await this.categoryService.getAll();
  }


}

