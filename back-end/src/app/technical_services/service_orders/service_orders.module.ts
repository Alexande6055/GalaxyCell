import { Module } from '@nestjs/common';
import { ServiceOrdersService } from './service_orders.service';
import { ServiceOrdersController } from './service_orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrderEntity } from './entities/service_order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceOrderEntity])],
  controllers: [ServiceOrdersController],
  providers: [ServiceOrdersService],
})
export class ServiceOrdersModule {}
