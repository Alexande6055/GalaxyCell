import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Repository } from 'typeorm/repository/Repository';
import { BrandEntity } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BrandService {

  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) { }


  async create(createBrandDto: CreateBrandDto) {
    const existingBrand = await this.brandRepository.findOne({ where: { name: createBrandDto.name } });
    if (existingBrand) {
      throw new Error('This brand already exists');
    }
    const brand = this.brandRepository.create(createBrandDto);
    return await this.brandRepository.save(brand);
  }

  async findAll() {
    return await this.brandRepository.find();
  }

  async findOne(id: string) {
    return await this.brandRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.preload({
      id: id,
      ...updateBrandDto
    });
    if (!brand) {
      throw new Error('Marca no existe');
    }
    try {
      return await this.brandRepository.save(brand);
    } catch (error) {
      if (error.code === '23505' || error.errno === 1062) {
        throw new ConflictException(`El nombre '${updateBrandDto.name}' ya está registrado en otra marca`);
      }
      throw new InternalServerErrorException('Error inesperado al actualizar la marca');
    }
  }

  async softDelete(id: string) {
    const brand = await this.brandRepository.findOne({ where: { id: id } });
    if (!brand) {
      throw new Error('Marca no existe');
    }
    
    return await this.brandRepository.softRemove(brand);
  }
}
