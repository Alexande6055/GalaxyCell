import { Injectable } from '@nestjs/common';
import { CategoryEntity } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDto } from '../dto/category.dto';


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
    ) { }

    async create(categoryDto: CategoryDto): Promise<CategoryEntity> {
        const existingCategory = await this.categoryRepository.findOne({
            where: { name: categoryDto.name },
        });

        if (existingCategory) {
            throw new Error('Ya existe una categoría con ese nombre');
        }
        const category = this.categoryRepository.create(categoryDto);
        return await this.categoryRepository.save(category);
    }


}
