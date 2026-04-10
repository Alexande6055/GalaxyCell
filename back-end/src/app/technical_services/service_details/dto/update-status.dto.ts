import { ArrayUnique, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateStatusDto {
    @IsString()
    @IsNotEmpty()
    status: string;

}