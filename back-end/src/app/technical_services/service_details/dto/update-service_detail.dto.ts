import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDetailDto } from './create-service_detail.dto';

export class UpdateServiceDetailDto extends PartialType(CreateServiceDetailDto) {}
