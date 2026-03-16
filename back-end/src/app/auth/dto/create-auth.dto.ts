import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UserCreateDTO {
    @ApiProperty()
    @IsString()
    nombre: string
    @ApiProperty()
    @IsString()
    password: string
    @ApiProperty()
    @IsString()
    email: string
}
