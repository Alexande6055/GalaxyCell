import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

/**
 * Objeto de Transferencia de Datos (DTO) para la actualización de un usuario existente.
 */
export class UserUpdateDTO {
    /**
     * Nuevo nombre completo del usuario.
     */
    @ApiProperty()
    @IsString()
    nombre: string

    /**
     * Nueva contraseña de la cuenta del usuario (opcional).
     */
    @ApiProperty()
    @IsOptional()
    @IsString()
    password?: string

    /**
     * Dirección de correo electrónico del usuario (se usa como identificador para la búsqueda).
     */
    @ApiProperty()
    @IsString()
    email: string
}
