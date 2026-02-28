import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
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

    // async findAll() {
    //     return await this.productRepository.find();
    // }

    // async findOne(id: string) {
    //     return await this.productRepository.findOne({ where: { id: id } });
    // }

    // async update(id: string, productDto: ProductDto) {
    //     const product = await this.productRepository.preload({
    //         id: id,
    //         ...productDto
    //     });
    //     if (!product) {
    //         throw new Error('Product no existe');
    //     }
    //     try {
    //         return await this.productRepository.save(product);
    //     } catch (error) {
    //         if (error.code === '23505' || error.errno === 1062) {
    //             throw new Error(`El nombre '${productDto.name}' ya está registrado en otra categoría`);
    //         }
    //         throw new Error('Error inesperado al actualizar el producto');
    //     }
    // }

    // async softDelete(id: string) {
    //     const product = await this.productRepository.findOne({ where: { id: id } });
    //     if (!product) {
    //         throw new Error('Product no existe');
    //     }
    //     return await this.productRepository.softRemove(product);


    // }

}
