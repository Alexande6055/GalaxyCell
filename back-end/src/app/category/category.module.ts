import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/app/products/entities/product.entity';
import { CategoryEntity } from './entities/category.entity';

/**
 * Módulo de NestJS encargado de agrupar y configurar la lógica de negocio relacionada con las categorías.
 * Registra el controlador CategoryController y provee el servicio CategoryService,
 * inyectando los repositorios de CategoryEntity y ProductEntity para interactuar con la BD.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity,ProductEntity]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule { }
