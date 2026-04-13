import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: (req, file, cb) => {
          cb(
            null,
            Date.now() +
              '-' +
              Math.round(Math.random() * 1e9) +
              extname(file.originalname),
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Solo imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
  create(@Body() dto: ProductDto, @UploadedFile() file?: Express.Multer.File) {
    return this.productService.create(dto, file);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
  ) {
    const activeFilter =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    return this.productService.findAll(
      page ?? 1,
      limit ?? 15,
      activeFilter,
      search,
      category,
      brand,
    );
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: (req, file, cb) => {
          cb(
            null,
            Date.now() +
              '-' +
              Math.round(Math.random() * 1e9) +
              extname(file.originalname),
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Solo imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() productDto: ProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productService.update(id, productDto, file);
  }

  @Patch(':id/toggle')
  toggleStatus(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.toggleStatus(id);
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.softDelete(id);
  }

  @Get('name/:name')
  findByName(
    @Param('name') name: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('isActive') isActive?: string,
  ) {
    const activeFilter =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    return this.productService.findByName(
      name,
      page ?? 1,
      limit ?? 15,
      activeFilter,
    );
  }

  @Get('category/:category')
  findByCategory(
    @Param('category', new ParseUUIDPipe()) category: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('isActive') isActive?: string,
  ) {
    const activeFilter =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    return this.productService.findByCategory(
      category,
      page ?? 1,
      limit ?? 15,
      activeFilter,
    );
  }

  @Get('brand/:brand')
  findByBrand(
    @Param('brand', new ParseUUIDPipe()) brand: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('isActive') isActive?: string,
  ) {
    const activeFilter =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    return this.productService.findByBrand(
      brand,
      page ?? 1,
      limit ?? 15,
      activeFilter,
    );
  }

  @Get('detail/:id')
getDetail(@Param('id') id: string) {
  return this.productService.detail(id);
}
}