import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


/**
 * Servicio encargado de gestionar la lógica de negocio para las categorías de productos.
 * Utiliza TypeORM para interactuar con la base de datos a través de la entidad CategoryEntity.
 */
@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
    ) { }

    /**
     * Crea una nueva categoría.
     * 
     * @param categoryDto - Datos de transferencia para crear la categoría.
     * @returns La entidad de la categoría guardada en la base de datos.
     * @throws {Error} Si ya existe una categoría con el mismo nombre.
     */
    async create(categoryDto: CategoryDto) {
        const existingCategory = await this.categoryRepository.findOne({
            where: { name: categoryDto.name },
        });

        if (existingCategory) {
            throw new Error('Ya existe una categoría con ese nombre');
        }
        const category = this.categoryRepository.create(categoryDto);
        return await this.categoryRepository.save(category);
    }

    /**
     * Actualiza una categoría existente por su ID.
     * 
     * @param id - Identificador único (UUID) de la categoría.
     * @param categoryDto - Datos de transferencia para actualizar la categoría.
     * @returns La categoría actualizada.
     * @throws {NotFoundException} Si la categoría con el ID proporcionado no existe.
     * @throws {ConflictException} Si el nuevo nombre de la categoría ya está en uso.
     * @throws {InternalServerErrorException} Para otros errores inesperados del servidor.
     */
    async update(id: string, categoryDto: UpdateCategoryDto){
        const category = await this.categoryRepository.preload({
            id: id,
            ...categoryDto
        });

        if (!category) {
            throw new NotFoundException(`La categoría con ID ${id} no existe`);
        }

        try {
            return await this.categoryRepository.save(category);
        } catch (error) {
            // Capturamos el error de llave duplicada (Postgres: 23505, MySQL: 1062)
            if (error.code === '23505' || error.errno === 1062) {
                throw new ConflictException(`El nombre '${categoryDto.name}' ya está registrado en otra categoría`);
            }

            throw new InternalServerErrorException('Error inesperado al actualizar la categoría');
        }
    }

    /**
     * Obtiene todas las categorías registradas.
     * 
     * @returns Un arreglo con todas las entidades de categoría.
     */
    async findAll() {
        return await this.categoryRepository.find();
    }

    /**
     * Busca una categoría específica por su ID.
     * 
     * @param id - Identificador único de la categoría.
     * @returns La entidad de la categoría encontrada o null si no existe.
     */
    async findOne(id: string) {
        return await this.categoryRepository.findOneBy({ id });
    }

    /**
     * Realiza un borrado lógico (soft delete) de una categoría por su ID.
     * 
     * @param id - Identificador único de la categoría.
     * @throws {NotFoundException} Si la categoría no existe.
     */
    async softDelete(id: string) {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) {
            throw new NotFoundException(`La categoría con ID ${id} no existe`);
        }
        await this.categoryRepository.softRemove(category);

    }

}
