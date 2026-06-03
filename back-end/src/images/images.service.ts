import { Injectable } from '@nestjs/common';
import { readdirSync } from 'fs';
import { join } from 'path';

/**
 * Servicio encargado de gestionar y listar las imágenes subidas al servidor.
 * Lee directamente del directorio local configurado para almacenar archivos.
 */
@Injectable()
export class ImagesService {
  /**
   * Lee la carpeta 'uploads' del sistema de archivos local y devuelve
   * un listado de todas las imágenes con su nombre de archivo y la URL relativa de acceso.
   * 
   * @returns Un arreglo de objetos conteniendo el filename y la url relativa de cada imagen.
   */
  getAllImages() {
    const uploadsPath = join(process.cwd(), 'uploads');

    const files = readdirSync(uploadsPath);

    return files.map((file) => ({
      filename: file,
      url: `/uploads/${file}`,
    }));
  }
}