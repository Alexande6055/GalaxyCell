import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ImagesService } from 'src/services/images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  controllers: [ProductController],
  providers: [ProductService,ImagesService],
})
export class ProductModule {}
