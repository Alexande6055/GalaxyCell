import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Repository } from 'typeorm/repository/Repository';
import { BrandEntity } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Servicio encargado de gestionar la lógica de negocio para las marcas de productos.
 * Interactúa con la base de datos a través de la entidad BrandEntity.
 */
@Injectable()
export class BrandService {

  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) { }


  /**
   * Crea una nueva marca en el sistema.
   * 
   * @param createBrandDto - DTO con los datos para la nueva marca.
   * @returns La marca guardada.
   * @throws {Error} Si ya existe una marca con el mismo nombre.
   */
  async create(createBrandDto: CreateBrandDto) {
    const existingBrand = await this.brandRepository.findOne({ where: { name: createBrandDto.name } });
    if (existingBrand) {
      throw new Error('This brand already exists');
    }
    const brand = this.brandRepository.create(createBrandDto);
    return await this.brandRepository.save(brand);
  }

  /**
   * Obtiene todas las marcas registradas en el sistema.
   * 
   * @returns Listado de todas las marcas.
   */
  async findAll() {
    return await this.brandRepository.find();
  }

  /**
   * Busca una marca por su ID.
   * 
   * @param id - Identificador único de la marca.
   * @returns La marca encontrada o null si no existe.
   */
  async findOne(id: string) {
    return await this.brandRepository.findOne({ where: { id: id } });
  }

  /**
   * Actualiza una marca existente.
   * 
   * @param id - Identificador único de la marca a actualizar.
   * @param updateBrandDto - DTO con los datos actualizados.
   * @returns La marca actualizada.
   * @throws {Error} Si la marca no existe.
   * @throws {ConflictException} Si el nuevo nombre ya pertenece a otra marca.
   * @throws {InternalServerErrorException} Para otros errores inesperados de la base de datos.
   */
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

  /**
   * Realiza un borrado lógico (soft delete) de una marca.
   * 
   * @param id - Identificador único de la marca a eliminar.
   * @returns La marca modificada tras aplicar el borrado lógico.
   * @throws {Error} Si la marca no existe.
   */
  async softDelete(id: string) {
    const brand = await this.brandRepository.findOne({ where: { id: id } });
    if (!brand) {
      throw new Error('Marca no existe');
    }
    
    return await this.brandRepository.softRemove(brand);
  }
}
