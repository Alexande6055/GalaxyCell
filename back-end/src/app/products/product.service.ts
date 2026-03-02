import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { ProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ) { }

    async create(productDto: ProductDto) {
        try {
            const exitingProduct = await this.productRepository.findOne({
                where: { name: productDto.name }
            });

            if (exitingProduct) {
                throw new Error('This product already exists');
            }

            // IMPORTANTE: Mapear los strings a objetos con ID
            const product = this.productRepository.create({
                ...productDto,
                category: { id: productDto.category } as any,
                brand: { id: productDto.brand } as any,
            });

            return await this.productRepository.save(product);
        } catch (error) {
            // Esto es lo que está imprimiendo tu consola
            console.error("Detalle del error:", error.message);
            throw new Error('Error al crear el producto');
        }
    }

    async findAll(page: number = 1, limit: number = 15) {
        try {
            const [data, total] = await this.productRepository.findAndCount({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    quantity: true,
                    image: true
                },
                skip: (page - 1) * limit,
                take: limit
            });

            return {
                data,
                total,
                page,
                lastPage: Math.ceil(total / limit)
            };

        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw new InternalServerErrorException('Error al obtener los productos');
        }
    }

    async findOne(id: string) {
        try {
            const product = await this.productRepository.findOne({
                where: { id: id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    quantity: true,
                    image: true
                }
            });
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;

        } catch (error) {
            console.error("Error al obtener el producto:", error.message);
            throw new Error('Error al obtener el producto');
        }

    }

    async update(id: string, productDto: ProductDto) {
        const product = await this.productRepository.preload({
            id: id,
            ...productDto,
            // Convertimos los strings del DTO en objetos que TypeORM entienda
            category: { id: productDto.category } as any,
            brand: { id: productDto.brand } as any,
        });

        if (!product) {
            throw new Error('El producto no existe');
        }

        try {
            return await this.productRepository.save(product);
        } catch (error) {
            // Manejo de errores de duplicados (Postgres: 23505, MySQL: 1062)
            if (error.code === '23505' || error.errno === 1062) {
                throw new Error(`El nombre '${productDto.name}' ya está registrado`);
            }
            console.error(error); // Es buena práctica loguear el error real
            throw new Error('Error inesperado al actualizar el producto');
        }
    }

    async softDelete(id: string) {
        const product = await this.productRepository.findOne({ where: { id: id } });
        if (!product) {
            throw new Error('Product no existe');
        }
        return await this.productRepository.softRemove(product);


    }

    async findByName(name: string, page: number = 1, limit: number = 15) {
        try {
            const [data, total] = await this.productRepository.findAndCount({
                where: { name: ILike(`%${name}%`) },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    quantity: true,
                    image: true,
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            if (total === 0) {
                throw new NotFoundException(`No se encontraron productos con el nombre: ${name}`);
            }

            return {
                data,
                total,
                page,
                lastPage: Math.ceil(total / limit),
            };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.error('Detalle técnico del error:', error?.message ?? error);
            throw new InternalServerErrorException('Error interno al buscar el producto por nombre');
        }
    }

    async findByCategory(categoryId: string, page: number = 1, limit: number = 15) {
        try {
            const [data, total] = await this.productRepository.findAndCount({
                where: { category: { id: categoryId } },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    quantity: true,
                    image: true,
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            if (total === 0) {
                throw new NotFoundException(`No se encontraron productos en la categoría: ${categoryId}`);
            }

            return {
                data,
                total,
                page,
                lastPage: Math.ceil(total / limit),
            };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.error('Detalle técnico del error:', error?.message ?? error);
            throw new InternalServerErrorException('Error interno al buscar productos por categoría');
        }
    }

    async findByBrand(brandId: string, page: number = 1, limit: number = 15) {
        try {
            const [data, total] = await this.productRepository.findAndCount({
                where: { brand: { id: brandId } },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    quantity: true,
                    image: true,
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            if (total === 0) {
                throw new NotFoundException(`No se encontraron productos de la marca: ${brandId}`);
            }

            return {
                data,
                total,
                page,
                lastPage: Math.ceil(total / limit),
            };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.error('Detalle técnico del error:', error?.message ?? error);
            throw new InternalServerErrorException('Error interno al buscar productos por marca');
        }
    }
}
