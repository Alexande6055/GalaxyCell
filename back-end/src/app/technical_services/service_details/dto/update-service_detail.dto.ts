import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDetailDto } from './create-service_detail.dto';
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateServiceDetailDto extends PartialType(CreateServiceDetailDto) {
@IsOptional()
  @IsEnum(['En proceso', 'Completado', 'Cancelado'])
  status?: string;

  @IsOptional()
  @IsString()
  technical_diagnosis?: string;

  @IsOptional()
  @IsArray()
  knowledge_base_ids?: string[];

}
