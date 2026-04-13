import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDetailDto } from './dto/create-service_detail.dto';
import { UpdateServiceDetailDto } from './dto/update-service_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceDetailEntity, StateType } from './entities/service_detail.entity';
import { In, Repository } from 'typeorm';
import { UpdateStatusDto } from './dto/update-status.dto';
import { KnowledgeBaseEntity } from '../knowledge_base/entities/knowledge_base.entity';
import { ServiceOrderEntity } from '../service_orders/entities/service_order.entity';
import {OrderStatus} from '../service_orders/entities/service_order.entity' 

@Injectable()
export class ServiceDetailsService {
  constructor(
    @InjectRepository(ServiceDetailEntity)
    private readonly serviceDetailRepository: Repository<ServiceDetailEntity>,

    @InjectRepository(KnowledgeBaseEntity)
    private readonly knowledgeBaseRepository: Repository<KnowledgeBaseEntity>,
      @InjectRepository(ServiceOrderEntity)
        private readonly serviceOrderRepository: Repository<ServiceOrderEntity>,
  ) {}

  async create(createServiceDetailDto: CreateServiceDetailDto) {
    try {
      const serviceDetail = this.serviceDetailRepository.create({
        ...createServiceDetailDto,
        serviceOrder: { id: createServiceDetailDto.serviceOrder } as any,
        equipment_type: { id: createServiceDetailDto.equipment_type } as any,
      });

      return await this.serviceDetailRepository.save(serviceDetail);
    } catch (error) {
      console.error('Error al crear detalle de servicio:', error);
      throw new InternalServerErrorException(
        'Falló guardar el detalle del servicio, verifique los datos e intente nuevamente',
      );
    }
  }

  async findAll(
    serviceOrderId: string,
    page: number = 1,
    limit: number = 15,
    status?: StateType,
  ) {
    try {
      const [data, total] = await this.serviceDetailRepository.findAndCount({
        where: {
          serviceOrder: { id: serviceOrderId },
          ...(status && { status }),
        },
        relations: {
          equipment_type: true,
          knowledge_base: true,
          serviceOrder: true,
        },
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error al obtener detalles del servicio:', error);
      throw new InternalServerErrorException(
        'Error al obtener los detalles del servicio',
      );
    }
  }

  async findOne(id: string, serviceOrderId: string) {
    try {
      const serviceDetail = await this.serviceDetailRepository.findOne({
        where: {
          id,
          serviceOrder: { id: serviceOrderId },
        },
        relations: {
          equipment_type: true,
          knowledge_base: true,
          serviceOrder: true,
        },
      });

      if (!serviceDetail) {
        throw new NotFoundException(
          'El detalle del servicio no existe o no pertenece a esta orden',
        );
      }

      return serviceDetail;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Error al obtener detalle del servicio:', error);
      throw new InternalServerErrorException(
        'Error al obtener el detalle del servicio',
      );
    }
  }

 async updateServiceDetailStatus(
  id: string,
  serviceOrderId: string,
  updateDto: UpdateServiceDetailDto,
) {
  try {
    // 1. Buscar el registro con sus relaciones
    const serviceDetail = await this.serviceDetailRepository.findOne({
      where: {
        id,
        serviceOrder: { id: serviceOrderId },
      },
      relations: { knowledge_base: true, serviceOrder: true }, // Importante traer serviceOrder
    });

    if (!serviceDetail) {
      throw new NotFoundException(
        'El detalle del servicio no existe o no pertenece a esta orden',
      );
    }

    // 2. Actualizar el Status y lógica de fecha de salida
    if (updateDto.status) {
      const newStatus = this.mapStatusToEnum(updateDto.status);
      serviceDetail.status = newStatus;

      if (newStatus === StateType.COMPLETED || newStatus === StateType.CANCELLED) {
        serviceDetail.exit_date = new Date();
      } else {
        serviceDetail.exit_date = null;
      }
    }

    // 3. Actualizar Diagnóstico
    if (updateDto.technical_diagnosis !== undefined) {
      serviceDetail.technical_diagnosis = updateDto.technical_diagnosis;
    }

    // 4. Actualizar Base de Conocimiento
    if (updateDto.knowledge_base_ids) {
      const kb = updateDto.knowledge_base_ids.length > 0
        ? await this.knowledgeBaseRepository.findBy({ id: In(updateDto.knowledge_base_ids) })
        : [];
      serviceDetail.knowledge_base = kb;
    }

    // 5. Guardar el detalle
    const savedDetail = await this.serviceDetailRepository.save(serviceDetail);

    // --- NUEVO REQUERIMIENTO: CIERRE AUTOMÁTICO DE ORDEN ---
    let orderAutoClosed = false;

    // Consultamos todos los detalles de esta orden para verificar sus estados
    const allDetails = await this.serviceDetailRepository.find({
      where: { serviceOrder: { id: serviceOrderId } },
    });

    // Verificamos si todos los detalles están en un estado final (Completado o Cancelado)
    const areAllDetailsFinished = allDetails.every(
      (detail) =>
        detail.status === StateType.COMPLETED ||
        detail.status === StateType.CANCELLED,
    );

    if (areAllDetailsFinished) {
      const order = await this.serviceOrderRepository.findOneBy({ id: serviceOrderId });
      
      // Solo actualizamos si la orden no estaba ya completada
      if (order && order.status !== OrderStatus.COMPLETADA) {
        order.status = OrderStatus.COMPLETADA;
        order.exit_date = new Date();
        await this.serviceOrderRepository.save(order);
        orderAutoClosed = true;
      }
    }

    // Retornamos el detalle y un flag para que el Front sepa que la orden se cerró
    return {
      ...savedDetail,
      orderAutoClosed, // Útil para mostrar un mensaje especial en el cliente
    };

  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    console.error('Error al actualizar detalle:', error);
    throw new InternalServerErrorException('Error al procesar la actualización');
  }
}

// Helper para mapear el string que viene del Front a tu Enum del Back
private mapStatusToEnum(status: string): StateType {
  switch (status) {
    case 'Completado': return StateType.COMPLETED;
    case 'En proceso': return StateType.IN_PROGRESS;
    case 'Cancelado': return StateType.CANCELLED;
    default: return StateType.IN_PROGRESS;
  }
}

  
  async updateStatus(
    id: string,
    serviceOrderId: string,
    updateStatusDto: UpdateStatusDto,
  ) {
    try {
      const serviceDetail = await this.serviceDetailRepository.findOne({
        where: {
          id,
          serviceOrder: { id: serviceOrderId },
        },
      });

      if (!serviceDetail) {
        throw new NotFoundException(
          'El detalle del servicio no existe o no pertenece a esta orden',
        );
      }

      serviceDetail.status =
        updateStatusDto.status.toLowerCase() === 'en proceso'
          ? StateType.IN_PROGRESS
          : StateType.CANCELLED;

      if (serviceDetail.status === StateType.CANCELLED) {
        serviceDetail.exit_date = new Date();
      }

      return await this.serviceDetailRepository.save(serviceDetail);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Error al actualizar estado:', error);
      throw new InternalServerErrorException(
        'Error al actualizar el estado',
      );
    }
  }

  async remove(id: string, serviceOrderId: string) {
    const serviceDetail = await this.serviceDetailRepository.findOne({
      where: {
        id,
        serviceOrder: { id: serviceOrderId },
      },
    });

    if (!serviceDetail) {
      throw new NotFoundException(
        'El detalle del servicio no existe o no pertenece a esta orden',
      );
    }

    try {
      return await this.serviceDetailRepository.softRemove(serviceDetail);
    } catch (error) {
      console.error('Error al eliminar detalle del servicio:', error);
      throw new InternalServerErrorException(
        'Error al eliminar el detalle del servicio',
      );
    }
  }
}