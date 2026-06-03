import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

/**
 * Módulo de NestJS para la administración y carga de imágenes.
 * Agrupa al controlador ImagesController y provee el servicio ImagesService.
 */
@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
