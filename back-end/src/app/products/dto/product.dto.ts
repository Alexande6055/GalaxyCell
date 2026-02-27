import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Alphanumeric } from "src/decorators/alphanumeric.decorator";
import { StrictFloat } from "src/decorators/strictFloat.decorator";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

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
    price: string;

    @StrictFloat()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    category: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}