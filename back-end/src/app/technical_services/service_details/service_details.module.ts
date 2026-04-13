import { Module } from '@nestjs/common';
import { ServiceDetailsService } from './service_details.service';
import { ServiceDetailsController } from './service_details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceDetailEntity } from './entities/service_detail.entity';
import { KnowledgeBaseEntity } from '../knowledge_base/entities/knowledge_base.entity';
import {ServiceOrderEntity} from '../service_orders/entities/service_order.entity'

@Module({
  imports:[TypeOrmModule.forFeature([ServiceDetailEntity,KnowledgeBaseEntity,ServiceOrderEntity])],
  controllers: [ServiceDetailsController],
  providers: [ServiceDetailsService],
})
export class ServiceDetailsModule {}
