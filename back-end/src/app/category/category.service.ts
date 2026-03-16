import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
    ) { }

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

    async findAll() {
        return await this.categoryRepository.find();
    }

    async findOne(id: string) {
        return await this.categoryRepository.findOneBy({ id });
    }

    async softDelete(id: string) {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) {
            throw new NotFoundException(`La categoría con ID ${id} no existe`);
        }
        await this.categoryRepository.softRemove(category);

    }

}
