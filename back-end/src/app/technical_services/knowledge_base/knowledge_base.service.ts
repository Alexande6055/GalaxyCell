import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge_base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge_base.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { KnowledgeBaseEntity } from './entities/knowledge_base.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @InjectRepository(KnowledgeBaseEntity)
    private readonly knowledgeBaseRepository: Repository<KnowledgeBaseEntity>,
  ) {}

  async create(createKnowledgeBaseDto: CreateKnowledgeBaseDto) {
    try {
      const knowledgeBase = this.knowledgeBaseRepository.create({
        ...createKnowledgeBaseDto,
        equipment_type: { id: createKnowledgeBaseDto.equipment_type } as any,
      });

      return await this.knowledgeBaseRepository.save(knowledgeBase);
    } catch (error) {
      console.error('Error al crear knowledge base:', error);
      throw new InternalServerErrorException(
        'Falló guardar el conocimiento, verifique los datos e intente nuevamente',
      );
    }
  }

  async findAll(page: number = 1, limit: number = 15) {
    try {
      const [data, total] = await this.knowledgeBaseRepository.findAndCount({
        relations: {
          equipment_type: true,
        },
        order: {
          createdAt: 'DESC',
        },
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
      console.error('Error al obtener conocimientos:', error);
      throw new InternalServerErrorException(
        'Error al obtener la base de conocimiento',
      );
    }
  }

  async findAllByEquipmentType(
    equipmentTypeId: string,
    page: number = 1,
    limit: number = 15,
  ) {
    try {
      const [data, total] = await this.knowledgeBaseRepository.findAndCount({
        where: {
          equipment_type: { id: equipmentTypeId },
        },
        relations: {
          equipment_type: true,
        },
        order: {
          createdAt: 'DESC',
        },
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
      console.error('Error al obtener conocimientos por tipo:', error);
      throw new InternalServerErrorException(
        'Error al obtener conocimientos por tipo de equipo',
      );
    }
  }

  async findOne(id: string) {
    try {
      const knowledgeBase = await this.knowledgeBaseRepository.findOne({
        where: { id },
        relations: {
          equipment_type: true,
        },
      });

      if (!knowledgeBase) {
        throw new NotFoundException(
          `El conocimiento con ID ${id} no existe`,
        );
      }

      return knowledgeBase;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Error al obtener conocimiento:', error);
      throw new InternalServerErrorException(
        'Error al obtener el conocimiento',
      );
    }
  }

  async update(id: string, updateKnowledgeBaseDto: UpdateKnowledgeBaseDto) {
    const knowledgeBase = await this.knowledgeBaseRepository.preload({
      id,
      ...updateKnowledgeBaseDto,
      ...(updateKnowledgeBaseDto.equipment_type && {
        equipment_type: { id: updateKnowledgeBaseDto.equipment_type } as any,
      }),
    });

    if (!knowledgeBase) {
      throw new NotFoundException(`El conocimiento con ID ${id} no existe`);
    }

    try {
      return await this.knowledgeBaseRepository.save(knowledgeBase);
    } catch (error) {
      console.error('Error al actualizar conocimiento:', error);
      throw new InternalServerErrorException(
        'Error al actualizar el conocimiento',
      );
    }
  }

  async remove(id: string) {
    const knowledgeBase = await this.knowledgeBaseRepository.findOne({
      where: { id },
    });

    if (!knowledgeBase) {
      throw new NotFoundException(`El conocimiento con ID ${id} no existe`);
    }

    try {
      return await this.knowledgeBaseRepository.softRemove(knowledgeBase);
    } catch (error) {
      console.error('Error al eliminar conocimiento:', error);
      throw new InternalServerErrorException(
        'Error al eliminar el conocimiento',
      );
    }
  }
}