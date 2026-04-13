import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class ImagesService {
  async saveProductImage(productId: string, file: Express.Multer.File) {
    try {
      const uploadsRoot = path.join(process.cwd(), 'uploads');
      const productDir = path.join(uploadsRoot, 'products', productId);

      // Crear carpeta
      await fs.mkdir(productDir, { recursive: true });

      const fileName = `${productId}.webp`;
      const outputPath = path.join(productDir, fileName);

      // --- CORRECCIÓN CRÍTICA ---
      // Si file.path no existe, usamos el buffer (Memoria).
      const input = file.path || file.buffer;

      if (!input) {
        throw new Error('No se recibió un archivo válido (path o buffer ausente)');
      }

      await sharp(input)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(outputPath);

      // Solo intentamos borrar si el archivo existía físicamente en el disco
      if (file.path) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.warn(`No se pudo eliminar el temporal en: ${file.path}`);
        }
      }

      // Normalizar ruta para la base de datos
      const relativePath = path
        .join('uploads', 'products', productId, fileName)
        .replace(/\\/g, '/');

      return {
        relativePath,
        url: `/${relativePath}`,
      };
    } catch (error) {
      console.error('Error en ImagesService:', error); // Log para debuggear en la terminal
      throw new InternalServerErrorException(
        'No se pudo procesar la imagen del producto',
      );
    }
  }

  async deleteProductImageByPath(relativePath?: string | null) {
    if (!relativePath) return;

    // Limpiamos el slash inicial si existe para evitar rutas absolutas erróneas
    const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
    const absolutePath = path.join(process.cwd(), cleanPath);

    try {
      await fs.unlink(absolutePath);
    } catch (error) {
      // Si no existe el archivo, no hacemos nada
    }
  }
}