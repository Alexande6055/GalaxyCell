import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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
    async findAll() {
      return this.productService.findAll();
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
}
