import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';

/**
 * Objeto de Transferencia de Datos (DTO) para la actualización de una marca existente.
 * Extiende de CreateBrandDto haciendo todos sus campos opcionales mediante PartialType.
 */
export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
