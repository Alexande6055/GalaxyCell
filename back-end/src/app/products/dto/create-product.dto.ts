import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Alphanumeric } from "src/decorators/alphanumeric.decorator";
import { StrictFloat } from "src/decorators/strictFloat.decorator";

/**
 * Objeto de Transferencia de Datos (DTO) para la creación y actualización de productos.
 * Define las reglas de validación y sanitización aplicables al registrar o modificar un producto.
 */
export class ProductDto {
    /**
     * Nombre comercial del producto. Debe ser una cadena alfanumérica.
     */
    @Alphanumeric()
    @IsString()
    @IsNotEmpty()
    name: string;

    /**
     * Descripción técnica del producto. Debe ser una cadena alfanumérica.
     */
    @Alphanumeric()
    @IsString()
    @IsNotEmpty()
    description: string;

    /**
     * Precio unitario del producto. Se limpia y formatea mediante StrictFloat.
     */
    @StrictFloat()
    @IsNumber()
    @IsNotEmpty()
    price: number;

    /**
     * Cantidad inicial de stock del producto. Se limpia y formatea mediante StrictFloat.
     */
    @StrictFloat()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    /**
     * UUID de la categoría asociada al producto.
     */
    @IsString()
    @IsNotEmpty({message: 'La categoría es requerida'})
    category: string;

    /**
     * UUID de la marca asociada al producto.
     */
    @IsString()
    @IsNotEmpty({message: 'La marca es requerida'})
    brand: string;
}