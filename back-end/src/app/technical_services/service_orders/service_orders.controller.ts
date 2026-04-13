import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ServiceOrdersService } from './service_orders.service';
import { CreateServiceOrderDto } from './dto/create-service_order.dto';
import { UpdateServiceOrderDto } from './dto/update-service_order.dto';

@Controller('service-orders')
export class ServiceOrdersController {
  constructor(private readonly serviceOrdersService: ServiceOrdersService) {}

  @Post()
  create(@Body() createServiceOrderDto: CreateServiceOrderDto) {
    return this.serviceOrdersService.create(createServiceOrderDto);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    if (search) {
      return this.serviceOrdersService.search(search, page, limit);
    }

    return this.serviceOrdersService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceOrdersService.findOne(id);
  }

 @Patch(':id')
update(@Param('id') id: string) {
  return this.serviceOrdersService.update(id);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceOrdersService.remove(id);
  }

  @Get('detail/:id')
getOrderDetail(@Param('id') id: string) {
  return this.serviceOrdersService.detail(id);
}
}