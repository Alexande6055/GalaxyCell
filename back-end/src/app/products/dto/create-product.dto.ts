import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Alphanumeric } from "src/decorators/alphanumeric.decorator";
import { StrictFloat } from "src/decorators/strictFloat.decorator";

export class ProductDto {
    @Alphanumeric()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Alphanumeric()
    @IsString()
    @IsNotEmpty()
    description: string;

    @StrictFloat()
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @StrictFloat()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
    
    @IsString()
    image: string;

    @IsString()
    @IsNotEmpty({message: 'La categoría es requerida'})
    category: string;

    @IsString()
    @IsNotEmpty({message: 'La marca es requerida'})
    brand: string;

}