import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

/**
 * Controlador para gestionar las peticiones HTTP relacionadas con las marcas de los productos.
 * Registra las rutas asociadas a '/brand'.
 */
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  /**
   * Endpoint para registrar una nueva marca.
   * RUTA: POST /brand
   * 
   * @param createBrandDto - DTO con la información de la marca a crear.
   * @returns La entidad de la marca creada.
   */
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  /**
   * Endpoint para listar todas las marcas del sistema.
   * RUTA: GET /brand
   * 
   * @returns Lista de todas las marcas registradas.
   */
  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  /**
   * Endpoint para obtener una marca específica por su ID.
   * RUTA: GET /brand/:id
   * 
   * @param id - Identificador único de la marca.
   * @returns La marca encontrada o null.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  /**
   * Endpoint para actualizar los datos de una marca existente.
   * RUTA: PATCH /brand/:id
   * 
   * @param id - Identificador único de la marca.
   * @param updateBrandDto - DTO con los datos a actualizar.
   * @returns La marca actualizada.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  /**
   * Endpoint para realizar el borrado lógico de una marca.
   * RUTA: DELETE /brand/:id
   * 
   * @param id - Identificador único de la marca.
   * @returns La marca marcada como eliminada de forma lógica.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.softDelete(id);
  }
}
