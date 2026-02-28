import { Body, Controller, Post } from '@nestjs/common';
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
}
