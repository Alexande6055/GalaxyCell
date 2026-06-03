import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

/**
 * Objeto de Transferencia de Datos (DTO) para la creación de un nuevo usuario en el sistema.
 */
export class UserCreateDTO {
    /**
     * Nombre completo del usuario.
     */
    @ApiProperty()
    @IsString()
    nombre: string

    /**
     * Contraseña de la cuenta del usuario.
     */
    @ApiProperty()
    @IsString()
    password: string

    /**
     * Dirección de correo electrónico del usuario.
     */
    @ApiProperty()
    @IsString()
    email: string
}
