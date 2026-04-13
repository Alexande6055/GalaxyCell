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
import { ServiceDetailsService } from './service_details.service';
import { CreateServiceDetailDto } from './dto/create-service_detail.dto';
import { UpdateServiceDetailDto } from './dto/update-service_detail.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { StateType } from './entities/service_detail.entity';

@Controller('service-details')
export class ServiceDetailsController {
  constructor(
    private readonly serviceDetailsService: ServiceDetailsService,
  ) {}

  @Post()
  create(@Body() createServiceDetailDto: CreateServiceDetailDto) {
    return this.serviceDetailsService.create(createServiceDetailDto);
  }

  @Get()
  findAll(
    @Query('serviceOrderId') serviceOrderId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '15',
    @Query('status') status?: StateType,
  ) {
    return this.serviceDetailsService.findAll(
      serviceOrderId,
      Number(page),
      Number(limit),
      status,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('serviceOrderId') serviceOrderId: string,
  ) {
    return this.serviceDetailsService.findOne(id, serviceOrderId);
  }

  // @Patch(':id')
  // finalizeServiceDetails(
  //   @Param('id') id: string,
  //   @Query('serviceOrderId') serviceOrderId: string,
  //   @Body() updateServiceDetailDto: UpdateServiceDetailDto,
  // ) {
  //   return this.serviceDetailsService.finalizeServiceDetails(
  //     id,
  //     serviceOrderId,
  //     updateServiceDetailDto,
  //   );
  // }
  

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('serviceOrderId') serviceOrderId: string,
  ) {
    return this.serviceDetailsService.remove(id, serviceOrderId);
  }

  // @Patch('status/:id')
  // updateStatus(
  //   @Param('id') id: string,
  //   @Query('serviceOrderId') serviceOrderId: string,
  //   @Body() updateStatusDto: UpdateStatusDto,
  // ) {
  //   return this.serviceDetailsService.updateStatus(
  //     id,
  //     serviceOrderId,
  //     updateStatusDto,
  //   );
  // }

  @Patch('status/:id')
  updateServiceDetail(
    @Param('id') id: string,
    @Query('serviceOrderId') serviceOrderId: string,
    @Body() updateDto: UpdateServiceDetailDto,
  ) {
    // Llamamos al nuevo método unificado del servicio
    return this.serviceDetailsService.updateServiceDetailStatus(
      id,
      serviceOrderId,
      updateDto,
    );
  }
}