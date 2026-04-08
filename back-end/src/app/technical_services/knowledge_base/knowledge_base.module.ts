import { Module } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge_base.service';
import { KnowledgeBaseController } from './knowledge_base.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeBaseEntity } from './entities/knowledge_base.entity';

@Module({
  imports:[TypeOrmModule.forFeature([KnowledgeBaseEntity])],
  controllers: [KnowledgeBaseController],
  providers: [KnowledgeBaseService],
})
export class KnowledgeBaseModule {}
