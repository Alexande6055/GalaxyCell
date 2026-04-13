import { 
  ConflictException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(categoryDto: CategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: categoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Esta categoría ya existe');
    }

    try {
      const category = this.categoryRepository.create(categoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la categoría');
    }
  }

  async findAll(page: number = 1, limit: number = 15, isActive?: boolean) {
    try {
      const [data, total] = await this.categoryRepository.findAndCount({
        where: {
          ...(isActive !== undefined && { isActive }),
        },
        select: {
          id: true,
          name: true,
          description: true,
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
      console.error('Error al obtener categorías:', error);
      throw new InternalServerErrorException('Error al obtener las categorías');
    }
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`La categoría con ID ${id} no existe`);
    }

    return category;
  }

  async update(id: string, categoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...categoryDto,
    });

    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }

    try {
      return await this.categoryRepository.save(category);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre de la categoría ya está en uso');
      }
      throw new InternalServerErrorException('Error al actualizar la categoría');
    }
  }

  /**
   * Cambia el estado (Activo/Inactivo)
   */
  async toggleStatus(id: string) {
    const category = await this.findOne(id);
    try {
      category.isActive = !category.isActive;
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new InternalServerErrorException('No se pudo cambiar el estado');
    }
  }

  /**
   * Eliminación lógica definitiva
   */
  async softDelete(id: string) {
    const category = await this.findOne(id);
    try {
      return await this.categoryRepository.softRemove(category);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la categoría');
    }
  }
}