import { PartialType } from '@nestjs/mapped-types';
import { CategoryDto } from './create-category.dto';

// Esto hace que name y description sean opcionales y hereden tus validaciones
/**
 * Objeto de Transferencia de Datos (DTO) para la actualización de una categoría existente.
 * Extiende de CategoryDto haciendo todos sus campos opcionales mediante PartialType.
 */
export class UpdateCategoryDto extends PartialType(CategoryDto) {
}