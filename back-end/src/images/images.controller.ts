import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImagesService } from './images.service';

/**
 * Controlador encargado de manejar la carga (upload) y listado de imágenes de la aplicación.
 * Las imágenes se guardan de forma local en la carpeta './uploads'.
 */
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * Endpoint para subir una sola imagen.
   * Utiliza Multer para interceptar el archivo en el parámetro 'image', validando que el mimetype sea de una imagen
   * válida (jpg, jpeg, png, webp) y asignándole un nombre único basado en timestamp.
   * RUTA: POST /images
   * 
   * @param file - Archivo de imagen subido por el cliente.
   * @returns Un objeto con el nombre asignado (filename) y la url relativa.
   * @throws {HttpException} Si no se recibe archivo o si el archivo no es una imagen válida.
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueName + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          callback(
            new HttpException(
              'Solo se permiten imágenes',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        'No se recibió archivo',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      filename: file.filename,
      url: `/uploads/${file.filename}`,
    };
  }

  /**
   * Endpoint para obtener un listado de todas las imágenes almacenadas localmente.
   * RUTA: GET /images
   * 
   * @returns Listado de todas las imágenes.
   */
  @Get()
  getAllImages() {
    return this.imagesService.getAllImages();
  }
}