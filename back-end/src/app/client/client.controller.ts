import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query 
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  findAll(
    @Query('page') page: number, 
    @Query('limit') limit: number
  ) {
    // Pasamos los parámetros de paginación al servicio
    return this.clientService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Eliminamos el '+' porque el ID es un UUID (string)
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateClientDto: UpdateClientDto
  ) {
    // Eliminamos el '+'
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // Eliminamos el '+'
    return this.clientService.remove(id);
  }
}