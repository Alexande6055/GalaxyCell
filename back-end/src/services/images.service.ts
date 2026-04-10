// images.service.ts
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import * as sharp from 'sharp';

@Injectable()
export class ImagesService {

    async saveProductImage(productId: string, file: Express.Multer.File) {
        const folder = join(process.cwd(), 'uploads', 'products', productId);
        await fs.mkdir(folder, { recursive: true });

        const fileName = `${randomUUID()}.webp`; // ahora SIEMPRE webp
        const finalPath = join(folder, fileName);

        await sharp(file.path)
            .resize(1200) // ancho máximo 1200px (mantiene proporción)
            .webp({ quality: 80 }) // compresión 80% (balance ideal)
            .toFile(finalPath);

        // eliminar archivo temporal
        await fs.unlink(file.path);

        const relativePath = `products/${productId}/${fileName}`;
        const url = `/uploads/${relativePath}`;

        return { fileName, relativePath, url };
    }
}