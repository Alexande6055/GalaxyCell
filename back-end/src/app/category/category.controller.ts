import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * Controlador para gestionar las rutas HTTP correspondientes a las categorías de productos.
 * Mapea las operaciones CRUD a las rutas '/category'.
 */
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  /**
   * Endpoint para crear una nueva categoría.
   * RUTA: POST /category/create
   * 
   * @param categoryDto - DTO con los datos para la nueva categoría.
   * @returns La categoría creada y guardada.
   */
  @Post('create')
  async create(@Body() categoryDto: CategoryDto) {
    return await this.categoryService.create(categoryDto);
  }

  /**
   * Endpoint para actualizar una categoría existente por su ID.
   * RUTA: PATCH /category/update/:id
   * 
   * @param id - Identificador único UUID de la categoría a actualizar.
   * @param categoryDto - DTO con los campos que se desean actualizar.
   * @returns La categoría modificada.
   */
  @Patch('update/:id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() categoryDto: UpdateCategoryDto) {
    return await this.categoryService.update(id, categoryDto);
  }

  /**
   * Endpoint para realizar un borrado lógico (soft delete) de una categoría por su ID.
   * RUTA: DELETE /category/delete/:id
   * 
   * @param id - Identificador único UUID de la categoría a eliminar.
   * @returns Promesa vacía o confirmación del borrado.
   */
  @Delete('delete/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoryService.softDelete(id);
  }

  /**
   * Endpoint para buscar una categoría por su ID.
   * RUTA: GET /category/:id
   * 
   * @param id - Identificador único UUID de la categoría.
   * @returns La entidad de la categoría si se encuentra, o null en su defecto.
   */
  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoryService.findOne(id);
  }

  /**
   * Endpoint para obtener el listado completo de categorías de productos.
   * RUTA: GET /category
   * 
   * @returns Listado de todas las categorías activas.
   */
  @Get()
  async getAll() {
    return await this.categoryService.findAll();
  }

}

