import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '../dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  async create(categoryDto: CategoryDto) {
    return await this.categoryService.create(categoryDto);
  }
}

