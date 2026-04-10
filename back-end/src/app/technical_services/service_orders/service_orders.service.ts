import { Injectable } from '@nestjs/common';
import { CreateServiceOrderDto } from './dto/create-service_order.dto';
import { UpdateServiceOrderDto } from './dto/update-service_order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceOrderEntity, IncomeType } from './entities/service_order.entity';
import { Repository } from 'typeorm';
import { ClientEntity } from 'src/app/client/entities/client.entity';
import { getFormattedDate, buildOrderCode } from 'src/utils/order_number.utils';

@Injectable()
export class ServiceOrdersService {
  constructor(
    @InjectRepository(ServiceOrderEntity)
    private readonly serviceOrderRepository: Repository<ServiceOrderEntity>,

    // @InjectRepository(ClientEntity)
    // private readonly clientRepository: Repository<ClientEntity>
  ) { }

  async create(createServiceOrderDto: CreateServiceOrderDto) {

    const income_type = createServiceOrderDto.income_type?.toLowerCase() === 'garantia' ? 'G' : 'E';

    const serviceOrder = this.serviceOrderRepository.create({
      order_number: await this.generateOrderCode(income_type),
      income_type: createServiceOrderDto.income_type?.toLowerCase() === 'garantia' ? IncomeType.GARANTIA : IncomeType.EXTERNO,
      entry_date: new Date(),
      client: { id: createServiceOrderDto.client } as any,
    });
    return await this.serviceOrderRepository.save(serviceOrder);
  }

  findAll() {
    try {
      return this.serviceOrderRepository.find();
    } catch (error) {
      throw new Error('Ocurrió un error al obtener las órdenes de servicio');
    }
  }

  findOne(id: string) {
    try {
      return this.serviceOrderRepository.findOne({ where: { client: { id: id } } });
    } catch (error) {
      throw new Error('Ocurrió un error al obtener la orden de servicio');
    }

  }

  async search(search: string) {
    try {
      return await this.serviceOrderRepository
        .createQueryBuilder('so')
        .leftJoinAndSelect('so.client', 'client')
        .orWhere('client.document_number ILIKE :search', { search: `%${search}%` })
        .orWhere('client.name ILIKE :search', { search: `%${search}%` })
        .orderBy('so.entry_date', 'DESC')
        .getMany();
    } catch (error) {
      throw new Error('Ocurrió un error al buscar las órdenes de servicio');
    }

  }

  update(id: number, updateServiceOrderDto: UpdateServiceOrderDto) {
    return `This action updates a #${id} serviceOrder`;
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

    const finalCode = `${income_type}-${today}-${nextNumber.toString().padStart(3, '0')}`;

    return finalCode;
  }
}
