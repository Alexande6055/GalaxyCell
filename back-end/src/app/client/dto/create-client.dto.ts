import { IsNotEmpty, IsString } from "class-validator";

export class CreateClientDto {
    @IsString()
    @IsNotEmpty()
    document_number: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;


}
