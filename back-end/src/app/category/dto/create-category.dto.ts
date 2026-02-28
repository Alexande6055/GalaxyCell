import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { StrictString } from "src/decorators/stricString.decorator";
import { Alphanumeric } from "src/decorators/alphanumeric.decorator";

export class CategoryDto {
    @StrictString() // Primero limpia
    @IsString()      // Asegura que es string post-limpieza
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @MaxLength(50, { message: 'El nombre es muy largo' })
    @MinLength(3, { message: 'El nombre es muy corto' })
    name: string;
    
    @Alphanumeric()
    @IsString()
    @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
    @MaxLength(500, { message: 'La descripción es muy larga' }) // <--- Límite razonable para descripciones
    @MinLength(10, { message: 'La descripción es muy corta' })  // <--- Límite razonable para descripciones
    description: string;
}