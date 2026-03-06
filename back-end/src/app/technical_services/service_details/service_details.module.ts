import { Module } from '@nestjs/common';
import { ServiceDetailsService } from './service_details.service';
import { ServiceDetailsController } from './service_details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceDetailEntity } from './entities/service_detail.entity';
import { KnowledgeBaseEntity } from '../knowledge_base/entities/knowledge_base.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ServiceDetailEntity,KnowledgeBaseEntity])],
  controllers: [ServiceDetailsController],
  providers: [ServiceDetailsService],
})
export class ServiceDetailsModule {}
