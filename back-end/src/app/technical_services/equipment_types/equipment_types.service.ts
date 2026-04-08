import { Injectable } from '@nestjs/common';
import { CreateEquipmentTypeDto } from './dto/create-equipment_type.dto';
import { UpdateEquipmentTypeDto } from './dto/update-equipment_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EquipmentTypeEntity } from './entities/equipment_type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EquipmentTypesService {
  @InjectRepository(EquipmentTypeEntity)
  private readonly equipmentTypeRepository: Repository<EquipmentTypeEntity>;


  async create(createEquipmentTypeDto: CreateEquipmentTypeDto) {
    const existingEquipmentType = await this.equipmentTypeRepository.findOne({
      where: { name: createEquipmentTypeDto.name },
    });

    if (existingEquipmentType) {
      throw new Error('Ya existe una equipo con ese nombre');
    }

    return this.equipmentTypeRepository.save(createEquipmentTypeDto);

  }

  async findAll() {
    try {
      return await this.equipmentTypeRepository.find();
    } catch (error) {
      throw new Error('Error al obtener los tipos de equipos');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} equipmentType`;
  }

  update(id: number, updateEquipmentTypeDto: UpdateEquipmentTypeDto) {
    return `This action updates a #${id} equipmentType`;
  }

  remove(id: number) {
    return `This action removes a #${id} equipmentType`;
  }
}
