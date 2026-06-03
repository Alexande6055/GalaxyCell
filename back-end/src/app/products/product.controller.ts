import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/create-product.dto';

/**
 * Controlador para gestionar las peticiones HTTP relativas a los productos.
 * Mapea las operaciones CRUD a las rutas '/product'.
 */
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

    /**
     * Endpoint para registrar un nuevo producto.
     * RUTA: POST /product
     * 
     * @param productDto - DTO con los datos del nuevo producto.
     * @returns La entidad del producto guardada.
     */
    @Post()
    async create(@Body() productDto: ProductDto) {
      return this.productService.create(productDto);
    }

    /**
     * Endpoint para obtener la lista de todos los productos.
     * RUTA: GET /product
     * 
     * @returns Listado de todos los productos.
     */
    @Get()
    async findAll() {
      return this.productService.findAll();
    }

    /**
     * Endpoint para obtener un producto por su ID.
     * RUTA: GET /product/:id
     * 
     * @param id - Identificador único UUID del producto.
     * @returns El producto encontrado o null.
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.productService.findOne(id);
    }

    /**
     * Endpoint para actualizar un producto existente por su ID.
     * RUTA: PATCH /product/:id
     * 
     * @param id - Identificador único UUID del producto.
     * @param productDto - DTO con los campos actualizados.
     * @returns El producto actualizado.
     */
    @Patch(':id')
    async update(@Param('id') id: string, @Body() productDto: ProductDto) {
      return this.productService.update(id, productDto);
    }

    /**
     * Endpoint para realizar el borrado lógico de un producto por su ID.
     * RUTA: DELETE /product/:id
     * 
     * @param id - Identificador único UUID del producto a eliminar.
     * @returns El producto marcado como eliminado.
     */
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.productService.softDelete(id);
    }
}
