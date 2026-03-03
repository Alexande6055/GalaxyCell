import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path/win32';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/tmp', // carpeta temporal
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) return cb(new Error('Solo imágenes'), false);
        cb(null, true);
      },
    }),
  )
  create(@Body() dto: ProductDto, @UploadedFile() file?: Express.Multer.File) {
    return this.productService.create(dto, file);
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
    return this.productService.findByBrand(brand, Number(page), Number(limit),);
  }
}
