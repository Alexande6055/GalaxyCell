import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from './create-product.dto';

/**
 * Objeto de Transferencia de Datos (DTO) para la actualización de un producto existente.
 * Extiende de ProductDto haciendo opcionales todos sus campos.
 */
export class UpdateProductDto extends PartialType(ProductDto) {
}
