import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';

/**
 * Módulo de NestJS encargado de agrupar y configurar la lógica de negocio relacionada con los productos.
 * Registra el controlador ProductController y provee el servicio ProductService,
 * inyectando el repositorio de ProductEntity para interactuar con la base de datos.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
