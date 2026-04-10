import { Injectable } from '@nestjs/common';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge_base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge_base.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { KnowledgeBaseEntity } from './entities/knowledge_base.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KnowledgeBaseService {

  constructor(
    @InjectRepository(KnowledgeBaseEntity)
    private readonly knowledgeBaseService: Repository<KnowledgeBaseEntity>,
  ) { }
  async create(createKnowledgeBaseDto: CreateKnowledgeBaseDto) {
    try {
      console.log(createKnowledgeBaseDto);

      const knowledgeBase = this.knowledgeBaseService.create({
        ...createKnowledgeBaseDto,
        equipment_type: { id: createKnowledgeBaseDto.equipment_type } as any,
      });
      await this.knowledgeBaseService.save(knowledgeBase);
      return knowledgeBase;

    } catch (error) {
      throw new Error('Falló guardar el conocimiento, verifique los datos e intente nuevamente');

    }

  }

  findAll() {
    return `This action returns all knowledgeBase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} knowledgeBase`;
  }

  update(id: number, updateKnowledgeBaseDto: UpdateKnowledgeBaseDto) {
    return `This action updates a #${id} knowledgeBase`;
  }

  remove(id: number) {
    return `This action removes a #${id} knowledgeBase`;
  }
}
