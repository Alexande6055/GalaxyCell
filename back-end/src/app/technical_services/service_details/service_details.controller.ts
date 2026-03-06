import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceDetailsService } from './service_details.service';
import { CreateServiceDetailDto } from './dto/create-service_detail.dto';
import { UpdateServiceDetailDto } from './dto/update-service_detail.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('service-details')
export class ServiceDetailsController {
  constructor(private readonly serviceDetailsService: ServiceDetailsService) {}

  @Post()
  create(@Body() createServiceDetailDto: CreateServiceDetailDto) {
    return this.serviceDetailsService.create(createServiceDetailDto);
  }

  @Get()
  findAll() {
    return this.serviceDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceDetailsService.findOne(+id);
  }

  @Patch(':id')
  finalizeServiceDetails(@Param('id') id: string, @Body() updateServiceDetailDto: UpdateServiceDetailDto) {
    return this.serviceDetailsService.finalizeServiceDetails(id, updateServiceDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceDetailsService.remove(+id);
  }

  @Patch('/status/:id')
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.serviceDetailsService.updateStatus(id, updateStatusDto);
  }
}
