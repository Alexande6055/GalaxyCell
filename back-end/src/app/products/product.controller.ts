import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }
  @Post()
  async create(@Body() productDto: ProductDto) {
    return this.productService.create(productDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15) {
    return this.productService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() productDto: ProductDto) {
    return this.productService.update(id, productDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productService.softDelete(id);
  }

  @Get('name/:name')
  async findByName(
    @Param('name') name: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '15') {
    return this.productService.findByName(name, Number(page), Number(limit));
  }

  @Get('category/:category')
  async findByCategory(
    @Param('category') category: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '15') {
    return this.productService.findByCategory(category, Number(page), Number(limit));
  }

  @Get('brand/:brand')
  async findByBrand(
    @Param('brand') brand: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '15',
  ) {
    return this.productService.findByBrand(brand,Number(page),Number(limit),);
  }
}
