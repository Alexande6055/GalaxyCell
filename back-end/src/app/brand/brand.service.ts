import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandEntity } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const existingBrand = await this.brandRepository.findOne({
      where: { name: createBrandDto.name },
    });

    if (existingBrand) {
      throw new ConflictException('Esta marca ya existe');
    }

    try {
      const brand = this.brandRepository.create(createBrandDto);
      return await this.brandRepository.save(brand);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la marca');
    }
  }

  async findAll(page: number = 1, limit: number = 15, isActive?: boolean) {
    try {
      const [data, total] = await this.brandRepository.findAndCount({
        where: {
          // Si isActive viene en el query, filtra. Si no, trae todos.
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
      console.error('Error al obtener marcas:', error);
      throw new InternalServerErrorException('Error al obtener las marcas');
    }
  }

  async findOne(id: string) {
    const brand = await this.brandRepository.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`La marca con ID ${id} no existe`);
    }

    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.preload({
      id,
      ...updateBrandDto,
    });

    if (!brand) {
      throw new NotFoundException('Marca no existe');
    }

    try {
      return await this.brandRepository.save(brand);
    } catch (error : any) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre de la marca ya está en uso');
      }
      throw new InternalServerErrorException('Error al actualizar la marca');
    }
  }

  /**
   * Cambia el estado (Activo/Inactivo) sin eliminar el registro
   */
  async toggleStatus(id: string) {
    const brand = await this.findOne(id);
    
    try {
      brand.isActive = !brand.isActive;
      return await this.brandRepository.save(brand);
    } catch (error) {
      throw new InternalServerErrorException('No se pudo cambiar el estado');
    }
  }

  /**
   * Eliminación lógica definitiva (Soft Delete)
   */
  async softDelete(id: string) {
    const brand = await this.findOne(id);
    try {
      return await this.brandRepository.softRemove(brand);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la marca');
    }
  }
}