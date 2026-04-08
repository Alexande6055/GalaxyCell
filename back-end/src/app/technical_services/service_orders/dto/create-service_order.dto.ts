import { IsNotEmpty, IsString } from "class-validator";

export class CreateServiceOrderDto {
    @IsNotEmpty()
    @IsString()
    client:string

    @IsNotEmpty()
    @IsString()
    income_type:string
}
