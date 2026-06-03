import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { StrictString } from "src/decorators/stricString.decorator";
import { Alphanumeric } from "src/decorators/alphanumeric.decorator";

/**
 * Objeto de Transferencia de Datos (DTO) para la creación de una nueva categoría.
 * Contiene las validaciones y transformaciones para asegurar que los datos de entrada sean correctos y seguros.
 */
export class CategoryDto {
    /**
     * Nombre de la categoría. Debe ser una cadena alfabética estricta de entre 3 y 50 caracteres.
     */
    @StrictString() // Primero limpia
    @IsString()      // Asegura que es string post-limpieza
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @MaxLength(50, { message: 'El nombre es muy largo' })
    @MinLength(3, { message: 'El nombre es muy corto' })
    name: string;
    
    /**
     * Descripción de la categoría. Debe ser una cadena alfanumérica de entre 10 y 500 caracteres.
     */
    @Alphanumeric()
    @IsString()
    @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
    @MaxLength(500, { message: 'La descripción es muy larga' }) // <--- Límite razonable para descripciones
    @MinLength(10, { message: 'La descripción es muy corta' })  // <--- Límite razonable para descripciones
    description: string;
}