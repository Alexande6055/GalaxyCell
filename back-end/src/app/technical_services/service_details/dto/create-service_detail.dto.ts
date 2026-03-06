import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateServiceDetailDto {

    @IsString()
    @IsNotEmpty()
    serviceOrder: string;

    @IsString()
    serial_number: string;

    @IsString()
    brand: string ;

    @IsString()
    model: string ;

    @IsString()
    @IsOptional()
    observations: string ;

    @IsString()
    reported_failure: string;

    @IsString()
    equipment_type: string;

}
