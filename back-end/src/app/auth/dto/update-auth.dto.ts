import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class UserUpdateDTO {
    @ApiProperty()
    @IsString()
    nombre: string
    @ApiProperty()
    @IsOptional()
    @IsString()
    password?: string
    @ApiProperty()
    @IsString()
    email: string
}
