import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  ParseUUIDPipe, 
  Patch, 
  Post, 
  Query, 
  ParseIntPipe 
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() categoryDto: CategoryDto) {
    return this.categoryService.create(categoryDto);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('isActive') isActive?: string,
  ) {
    const activeFilter = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.categoryService.findAll(page ?? 1, limit ?? 15, activeFilter);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() categoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(id, categoryDto);
  }

  /**
   * Endpoint para cambiar estado (isActive)
   */
  @Patch(':id/toggle')
  toggleStatus(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.toggleStatus(id);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.softDelete(id);
  }
}