import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDetailDto } from './create-service_detail.dto';
import { ArrayUnique, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateServiceDetailDto extends PartialType(CreateServiceDetailDto) {
    @IsString()
    @IsNotEmpty()
    technical_diagnosis: string;

    
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUUID('4', { each: true })
    knowledge_base_ids?: string[];

}
