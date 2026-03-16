import { PartialType } from '@nestjs/mapped-types';
import { CategoryDto } from './create-category.dto';

// Esto hace que name y description sean opcionales y hereden tus validaciones
export class UpdateCategoryDto extends PartialType(CategoryDto) {
}