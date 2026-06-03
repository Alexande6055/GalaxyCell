import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandEntity } from './entities/brand.entity';

/**
 * Módulo de NestJS encargado de agrupar y configurar la lógica de negocio relacionada con las marcas de los productos.
 * Registra el controlador BrandController y provee el servicio BrandService,
 * inyectando el repositorio de BrandEntity para persistencia de datos.
 */
@Module({
  imports:[TypeOrmModule.forFeature([BrandEntity])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
