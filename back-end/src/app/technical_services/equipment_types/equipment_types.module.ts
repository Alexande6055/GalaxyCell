import { Module } from '@nestjs/common';
import { EquipmentTypesService } from './equipment_types.service';
import { EquipmentTypesController } from './equipment_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentTypeEntity } from './entities/equipment_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentTypeEntity])],
  controllers: [EquipmentTypesController],
  providers: [EquipmentTypesService],
})
export class EquipmentTypesModule { }


