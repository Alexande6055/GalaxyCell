import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'auth/entities/auth.entity';
import { RolUsuario } from 'src/utils/enums/RolUsuarios.enum';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>
  ) { }
  async buscarPorUidFirebase(uid: string): Promise<Partial<Auth>> {
    const user = await this.authRepository.findOneBy({ uidFirebase: uid });
    if (!user) throw new NotFoundException("User not found")
    return user;
  }
}
