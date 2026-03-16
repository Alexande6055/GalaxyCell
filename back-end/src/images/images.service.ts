import { Injectable } from '@nestjs/common';
import { readdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
  getAllImages() {
    const uploadsPath = join(process.cwd(), 'uploads');

    const files = readdirSync(uploadsPath);

    return files.map((file) => ({
      filename: file,
      url: `/uploads/${file}`,
    }));
  }
}