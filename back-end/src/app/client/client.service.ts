import { 
  ConflictException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    // Validamos si ya existe el documento o el correo
    const existingClient = await this.clientRepository.findOne({
      where: [
        { document_number: createClientDto.document_number },
        { email: createClientDto.email }
      ],
    });

    if (existingClient) {
      const field = existingClient.document_number === createClientDto.document_number 
        ? 'documento' 
        : 'correo electrónico';
      throw new ConflictException(`Ya existe un cliente registrado con este ${field}`);
    }

    try {
      const client = this.clientRepository.create(createClientDto);
      return await this.clientRepository.save(client);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el cliente, verifique los datos ingresados');
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const [data, total] = await this.clientRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return {
        data,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener la lista de clientes con paginación');
    }
  }

  async findOne(id: string) {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['serviceOrders'] 
    });

    if (!client) {
      throw new NotFoundException(`El cliente con ID ${id} no existe`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.preload({
      id,
      ...updateClientDto,
    });

    if (!client) {
      throw new NotFoundException(`No se pudo encontrar el cliente con ID ${id} para actualizar`);
    }

    try {
      return await this.clientRepository.save(client);
    } catch (error: any) {
      // Error 23505: Unique violation en PostgreSQL
      if (error.code === '23505') {
        throw new ConflictException('El documento o email ya pertenece a otro cliente registrado');
      }
      throw new InternalServerErrorException('Error al actualizar el cliente');
    }
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    try {
      return await this.clientRepository.softRemove(client);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el cliente');
    }
  }
}