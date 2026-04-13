import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceOrderDto } from './dto/create-service_order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ServiceOrderEntity,
  IncomeType,
  OrderStatus,
} from './entities/service_order.entity';
import { Repository } from 'typeorm';
import { getFormattedDate } from 'src/utils/order_number.utils';

@Injectable()
export class ServiceOrdersService {
  constructor(
    @InjectRepository(ServiceOrderEntity)
    private readonly serviceOrderRepository: Repository<ServiceOrderEntity>,
  ) {}

  async create(createServiceOrderDto: CreateServiceOrderDto) {
    try {
      const income_type =
        createServiceOrderDto.income_type?.toLowerCase() === 'garantia'
          ? 'G'
          : 'E';

      const serviceOrder = this.serviceOrderRepository.create({
        order_number: await this.generateOrderCode(income_type),
        income_type:
          createServiceOrderDto.income_type?.toLowerCase() === 'garantia'
            ? IncomeType.GARANTIA
            : IncomeType.EXTERNO,
        status: OrderStatus.PENDIENTE,
        entry_date: new Date(),
        client: { id: createServiceOrderDto.client } as any,
      });

      return await this.serviceOrderRepository.save(serviceOrder);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al crear la orden de servicio',
      );
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const query = this.serviceOrderRepository
        .createQueryBuilder('so')
        .leftJoinAndSelect('so.client', 'client')
        .loadRelationCountAndMap('so.detailsCount', 'so.serviceDetails')
        .orderBy('so.createdAt', 'DESC');

      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las órdenes de servicio',
      );
    }
  }

  async findOne(id: string) {
    try {
      const serviceOrder = await this.serviceOrderRepository
        .createQueryBuilder('so')
        .leftJoinAndSelect('so.client', 'client')
        .leftJoinAndSelect('so.serviceDetails', 'serviceDetails')
        .loadRelationCountAndMap('so.detailsCount', 'so.serviceDetails')
        .where('so.id = :id', { id })
        .getOne();

      if (!serviceOrder) {
        throw new NotFoundException(
          `La orden de servicio con ID ${id} no existe`,
        );
      }

      return serviceOrder;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ocurrió un error al obtener la orden de servicio',
      );
    }
  }

  async search(search: string, page: number = 1, limit: number = 10) {
    try {
      const query = this.serviceOrderRepository
        .createQueryBuilder('so')
        .leftJoinAndSelect('so.client', 'client')
        .loadRelationCountAndMap('so.detailsCount', 'so.serviceDetails')
        .orderBy('so.entry_date', 'DESC');

      if (search && search.trim() !== '') {
        query.andWhere(
          `
          client.document_number ILIKE :search
          OR client.name ILIKE :search
          OR client."lastName" ILIKE :search
          OR so.order_number ILIKE :search
          `,
          { search: `%${search}%` },
        );
      }

      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al buscar las órdenes de servicio',
      );
    }
  }

  async update(id: string) {
    const serviceOrder = await this.serviceOrderRepository.findOne({
      where: { id },
    });

    if (!serviceOrder) {
      throw new NotFoundException(
        `La orden de servicio con ID ${id} no existe`,
      );
    }

    try {
      serviceOrder.status = OrderStatus.COMPLETADA;
      serviceOrder.exit_date = new Date();

      return await this.serviceOrderRepository.save(serviceOrder);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al actualizar la orden de servicio',
      );
    }
  }

  async remove(id: string) {
    const serviceOrder = await this.findOne(id);

    try {
      return await this.serviceOrderRepository.softRemove(serviceOrder);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al eliminar la orden de servicio',
      );
    }
  }

  async generateOrderCode(income_type: string): Promise<string> {
    const today = getFormattedDate(new Date());
    const pattern = `${income_type}-${today}-%`;

    const lastOrder = await this.serviceOrderRepository
      .createQueryBuilder('service_order')
      .where('service_order.order_number LIKE :pattern', { pattern })
      .orderBy('service_order.order_number', 'DESC')
      .getOne();

    let nextNumber = 1;

    if (lastOrder) {
      const parts = lastOrder.order_number.split('-');
      const lastSequence = parseInt(parts[2]);
      nextNumber = lastSequence + 1;
    }

    return `${income_type}-${today}-${nextNumber.toString().padStart(3, '0')}`;
  }

  async detail(id: string) {
    try {
      const serviceOrder = await this.serviceOrderRepository.findOne({
        where: { id },
        relations: {
          client: true, // Datos del cliente
          serviceDetails: {
            equipment_type: true, // Tipo de equipo de cada detalle
            knowledge_base: true, // Base de conocimiento (si existe) asociada al detalle
          },
        },
      });

      if (!serviceOrder) {
        throw new NotFoundException(
          `La orden de servicio con ID ${id} no existe`,
        );
      }

      // Estructuramos la respuesta para que sea clara
      return {
        order_info: {
          id: serviceOrder.id,
          order_number: serviceOrder.order_number,
          income_type: serviceOrder.income_type,
          status: serviceOrder.status,
          entry_date: serviceOrder.entry_date,
          exit_date: serviceOrder.exit_date,
        },
        client_info: {
          id: serviceOrder.client.id,
          name: serviceOrder.client.name,
          lastName: serviceOrder.client.lastName,
          document_number: serviceOrder.client.document_number,
          // Agrega aquí otros campos relevantes del cliente que necesites
        },
        details: serviceOrder.serviceDetails.map((detail) => ({
          id: detail.id,
          serial_number: detail.serial_number,
          brand: detail.brand,
          model: detail.model,
          status: detail.status,
          reported_failure: detail.reported_failure,
          technical_diagnosis: detail.technical_diagnosis,
          equipment_type: detail.equipment_type?.name,
          exit_date: detail.exit_date,
          observations: detail.observations,
          // Si tiene base de conocimientos, mapeamos los títulos y soluciones
          applied_solutions: detail.knowledge_base?.map((kb) => ({
            id: kb.id,
            error_title: kb.error_title,
            solution: kb.solution,
            root_cause: kb.root_cause
          })) || [],
        })),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener el detalle completo de la orden',
      );
    }
  }
}