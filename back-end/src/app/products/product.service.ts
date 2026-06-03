import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/create-product.dto';

/**
 * Servicio encargado de gestionar la lógica de negocio relativa a los productos.
 * Utiliza TypeORM para comunicarse con la base de datos para la entidad ProductEntity.
 */
@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ) { }

    /**
     * Registra un nuevo producto en la base de datos.
     * Mapea los campos de categoría y marca del DTO en estructuras que TypeORM pueda guardar relacionalmente.
     * 
     * @param productDto - DTO con los datos del nuevo producto.
     * @returns La entidad del producto guardada.
     * @throws {Error} Si el producto con el mismo nombre ya existe, o si ocurre un fallo al guardar.
     */
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

    /**
     * Obtiene el listado de todos los productos registrados.
     * 
     * @returns Arreglo de entidades de producto.
     */
    async findAll() {
        return await this.productRepository.find();
    }

    /**
     * Obtiene la información de un producto por su ID.
     * 
     * @param id - Identificador único UUID del producto.
     * @returns El producto encontrado o null.
     */
    async findOne(id: string) {
        return await this.productRepository.findOne({ where: { id: id } });
    }

    /**
     * Actualiza la información de un producto existente.
     * 
     * @param id - Identificador único UUID del producto.
     * @param productDto - DTO con la información a actualizar.
     * @returns La entidad del producto actualizada y guardada.
     * @throws {Error} Si el producto no existe o si ocurre un error de llave duplicada.
     */
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

    /**
     * Aplica un borrado lógico (soft delete) a un producto por su ID.
     * 
     * @param id - Identificador único UUID del producto.
     * @returns La entidad del producto modificada tras el borrado lógico.
     * @throws {Error} Si el producto no existe.
     */
    async softDelete(id: string) {
        const product = await this.productRepository.findOne({ where: { id: id } });
        if (!product) {
            throw new Error('Product no existe');
        }
        return await this.productRepository.softRemove(product);


    }

}
