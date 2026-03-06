import { Injectable } from '@nestjs/common';
import { CreateServiceDetailDto } from './dto/create-service_detail.dto';
import { UpdateServiceDetailDto } from './dto/update-service_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceDetailEntity, StateType } from './entities/service_detail.entity';
import { In, Repository } from 'typeorm';
import { UpdateStatusDto } from './dto/update-status.dto';
import { KnowledgeBaseEntity } from '../knowledge_base/entities/knowledge_base.entity';

@Injectable()
export class ServiceDetailsService {

  constructor(
    @InjectRepository(ServiceDetailEntity)
    private readonly serviceDetailRepository: Repository<ServiceDetailEntity>,

    @InjectRepository(KnowledgeBaseEntity)
    private readonly knowledgeBaseRepository: Repository<KnowledgeBaseEntity>,
  ) { }

  async create(createServiceDetailDto: CreateServiceDetailDto) {
    try {
      const serviceDetail = this.serviceDetailRepository.create({
        ...createServiceDetailDto,
        serviceOrder: { id: createServiceDetailDto.serviceOrder } as any,
        equipment_type: { id: createServiceDetailDto.equipment_type } as any,
      });
      await this.serviceDetailRepository.save(serviceDetail);
    } catch (error) {
      throw new Error('Falló guardar el detalle del servicio, verifique los datos e intente nuevamente');
    }
  }

  async findAll() {

    try {
      return await this.serviceDetailRepository.find();
    } catch (error) {
      throw new Error('Error al obtener los detalles del servicio');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceDetail`;
  }

  async finalizeServiceDetails(id: string, updateServiceDetailDto: UpdateServiceDetailDto) {
    try {
      const serviceDetail = await this.serviceDetailRepository.findOne({
        where: { id },
        relations: { knowledge_base: true }, // importante para actualizar relación
      });

      if (!serviceDetail) throw new Error('El detalle del servicio no existe');

      // Campos de finalización
      serviceDetail.exit_date = new Date();
      serviceDetail.technical_diagnosis = updateServiceDetailDto.technical_diagnosis;
      serviceDetail.status = StateType.COMPLETED;

      // ✅ Actualizar ManyToMany (tabla intermedia)
      if (updateServiceDetailDto.knowledge_base_ids) {
        const kb = await this.knowledgeBaseRepository.findBy({
          id: In(updateServiceDetailDto.knowledge_base_ids),
        });

        serviceDetail.knowledge_base = kb; // esto crea/actualiza registros en la tabla intermedia
      }

      return await this.serviceDetailRepository.save(serviceDetail);
    } catch (error) {
      throw new Error('Error al actualizar');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} serviceDetail`;
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {

    try {
      const serviceDetail = await this.serviceDetailRepository.findOne({
        where: { id }
      });
      if (!serviceDetail) {
        throw new Error('El detalle del servicio no existe');
      }
      serviceDetail.status = updateStatusDto.status.toLowerCase() === 'en proceso' ? StateType.IN_PROGRESS : StateType.CANCELLED;
      if (serviceDetail.status === StateType.CANCELLED) {
        serviceDetail.exit_date = new Date();
      }
      return await this.serviceDetailRepository.save(serviceDetail);

    } catch (error) {
      throw new Error('Error al actualizar el estado ');

    }
  }

  // async 
}
