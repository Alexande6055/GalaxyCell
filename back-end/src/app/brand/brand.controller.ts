import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe 
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  /**
   * Obtiene marcas con paginación y filtro de estado opcional.
   * Ejemplo: /brand?page=1&limit=10&isActive=true
   */
  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('isActive') isActive?: string, // Viene como string desde la URL
  ) {
    // Convertimos el string 'true'/'false' a booleano real
    const activeFilter = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    
    return this.brandService.findAll(page ?? 1, limit ?? 15, activeFilter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  /**
   * Endpoint para el "Eliminado Lógico" (Toggle de isActive)
   * Se dispara cuando haces clic en el escudo en el Frontend.
   */
  @Patch(':id/toggle')
  toggleStatus(@Param('id') id: string) {
    return this.brandService.toggleStatus(id);
  }

  /**
   * Eliminación definitiva (Soft Delete)
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.softDelete(id);
  }
}