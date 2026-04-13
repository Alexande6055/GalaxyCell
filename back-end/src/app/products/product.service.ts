import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { ProductDto } from './dto/create-product.dto';
import { ImagesService } from 'src/services/images.service';
import { promises as fs } from 'fs';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly imagesService: ImagesService,
  ) {}

  async create(productDto: ProductDto, file?: Express.Multer.File) {
    let saved: ProductEntity | null = null;

    try {
      const existingProduct = await this.productRepository.findOne({
        where: { name: productDto.name },
      });

      if (existingProduct) {
        throw new ConflictException('El nombre del producto ya existe');
      }

      const product = this.productRepository.create({
        ...productDto,
        category: { id: productDto.category } as any,
        brand: { id: productDto.brand } as any,
      });

      saved = await this.productRepository.save(product);

      if (file) {
        const img = await this.imagesService.saveProductImage(saved.id, file);
        saved.coverImagePath = img.relativePath;
        saved = await this.productRepository.save(saved);
      }

      return saved;
    } catch (error) {
      if (file?.path) {
        try {
          await fs.unlink(file.path);
        } catch {}
      }

      if (saved?.id) {
        try {
          await this.productRepository.delete(saved.id);
        } catch {}
      }

      if (error instanceof ConflictException) {
        throw error;
      }

      console.error('Error create product:', error);
      throw new InternalServerErrorException(
        'Falló guardar el producto, verifique los datos e intente nuevamente',
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 15,
    isActive?: boolean,
    search?: string,
    category?: string,
    brand?: string,
  ) {
    try {
      const qb = this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .leftJoin('product.brand', 'brand')
        .select([
          'product.id',
          'product.name',
          'product.description',
          'product.price',
          'product.quantity',
          'product.coverImagePath',
          'product.isActive',
          'product.createdAt',
          'category.id',
          'category.name',
          'brand.id',
          'brand.name',
        ])
        .orderBy('product.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (isActive !== undefined) {
        qb.andWhere('product.isActive = :isActive', { isActive });
      }

      if (search) {
        qb.andWhere(
          '(product.name ILIKE :search OR product.description ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (category) {
        qb.andWhere('category.id = :category', { category });
      }

      if (brand) {
        qb.andWhere('brand.id = :brand', { brand });
      }

      const [data, total] = await qb.getManyAndCount();

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw new InternalServerErrorException('Error al obtener los productos');
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: {
          category: true,
          brand: true,
        },
      });

      if (!product) {
        throw new NotFoundException(`El producto con ID ${id} no existe`);
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error al obtener el producto:', error);
      throw new InternalServerErrorException('Error al obtener el producto');
    }
  }

  async update(id: string, productDto: ProductDto, file?: Express.Multer.File) {
    const existing = await this.findOne(id);

    const product = await this.productRepository.preload({
      id,
      ...productDto,
      category: { id: productDto.category } as any,
      brand: { id: productDto.brand } as any,
    });

    if (!product) {
      throw new NotFoundException('El producto no existe');
    }

    try {
      let updated = await this.productRepository.save(product);

      if (file) {
        if (existing.coverImagePath) {
          await this.imagesService.deleteProductImageByPath(existing.coverImagePath);
        }

        const img = await this.imagesService.saveProductImage(updated.id, file);
        updated.coverImagePath = img.relativePath;
        updated = await this.productRepository.save(updated);
      }

      return updated;
    } catch (error: any) {
      if (file?.path) {
        try {
          await fs.unlink(file.path);
        } catch {}
      }

      if (error.code === '23505' || error.errno === 1062) {
        throw new ConflictException(
          `El nombre '${productDto.name}' ya está registrado`,
        );
      }

      console.error('Error al actualizar producto:', error);
      throw new InternalServerErrorException(
        'Error inesperado al actualizar el producto',
      );
    }
  }

  async toggleStatus(id: string) {
    const product = await this.findOne(id);

    try {
      product.isActive = !product.isActive;
      return await this.productRepository.save(product);
    } catch (error) {
      console.error('Error al cambiar estado del producto:', error);
      throw new InternalServerErrorException(
        'No se pudo cambiar el estado del producto',
      );
    }
  }

  async softDelete(id: string) {
    const product = await this.findOne(id);

    try {
      return await this.productRepository.softRemove(product);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw new InternalServerErrorException('Error al eliminar el producto');
    }
  }

  async findByName(
    name: string,
    page: number = 1,
    limit: number = 15,
    isActive?: boolean,
  ) {
    try {
      const [data, total] = await this.productRepository.findAndCount({
        where: {
          name: ILike(`%${name}%`),
          ...(isActive !== undefined && { isActive }),
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
          coverImagePath: true,
          isActive: true,
          createdAt: true,
        },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error al buscar productos por nombre:', error);
      throw new InternalServerErrorException(
        'Error interno al buscar el producto por nombre',
      );
    }
  }

  async findByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 15,
    isActive?: boolean,
  ) {
    try {
      const [data, total] = await this.productRepository.findAndCount({
        where: {
          category: { id: categoryId },
          ...(isActive !== undefined && { isActive }),
        },
        relations: {
          category: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
          coverImagePath: true,
          isActive: true,
          createdAt: true,
          category: {
            id: true,
            name: true,
          },
        },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error al buscar productos por categoría:', error);
      throw new InternalServerErrorException(
        'Error interno al buscar productos por categoría',
      );
    }
  }

  async findByBrand(
    brandId: string,
    page: number = 1,
    limit: number = 15,
    isActive?: boolean,
  ) {
    try {
      const [data, total] = await this.productRepository.findAndCount({
        where: {
          brand: { id: brandId },
          ...(isActive !== undefined && { isActive }),
        },
        relations: {
          brand: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
          coverImagePath: true,
          isActive: true,
          createdAt: true,
          brand: {
            id: true,
            name: true,
          },
        },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error al buscar productos por marca:', error);
      throw new InternalServerErrorException(
        'Error interno al buscar productos por marca',
      );
    }
  }


  async detail(id: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: {
          category: true,
          brand: true,
        },
        // Seleccionamos campos específicos si quieres evitar datos sensibles o pesados
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
          coverImagePath: true,
          isActive: true,
          createdAt: true,
          updatedAt: true, // Si lo tienes en tu entidad
          category: {
            id: true,
            name: true,
          },
          brand: {
            id: true,
            name: true,
          },
        },
      });

      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      // Opcional: Si quieres que el frontend reciba la URL absoluta directamente
      // const host = 'http://localhost:3000'; // Esto debería venir de variables de entorno
      // const detailResponse = {
      //   ...product,
      //   fullImageUrl: product.coverImagePath ? `${host}/${product.coverImagePath}` : null
      // };

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error al obtener el detalle del producto:', error);
      throw new InternalServerErrorException('Error al cargar el detalle del producto');
    }
  }
}