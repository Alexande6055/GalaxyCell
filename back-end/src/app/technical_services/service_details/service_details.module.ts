import { Module } from '@nestjs/common';
import { ServiceDetailsService } from './service_details.service';
import { ServiceDetailsController } from './service_details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceDetailEntity } from './entities/service_detail.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ServiceDetailEntity])],
  controllers: [ServiceDetailsController],
  providers: [ServiceDetailsService],
})
export class ServiceDetailsModule {}
