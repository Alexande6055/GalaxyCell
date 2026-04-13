import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge_base.service';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge_base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge_base.dto';

@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Post()
  create(@Body() createKnowledgeBaseDto: CreateKnowledgeBaseDto) {
    return this.knowledgeBaseService.create(createKnowledgeBaseDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '15',
    @Query('equipmentTypeId') equipmentTypeId?: string,
  ) {
    if (equipmentTypeId) {
      return this.knowledgeBaseService.findAllByEquipmentType(
        equipmentTypeId,
        Number(page),
        Number(limit),
      );
    }

    return this.knowledgeBaseService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.knowledgeBaseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateKnowledgeBaseDto: UpdateKnowledgeBaseDto,
  ) {
    return this.knowledgeBaseService.update(id, updateKnowledgeBaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.knowledgeBaseService.remove(id);
  }
}