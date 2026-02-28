import { Injectable } from '@nestjs/common';
import { Auth } from 'auth/entities/auth.entity';
import { RolUsuario } from 'src/utils/enums/RolUsuarios.enum';

@Injectable()
export class AuthService {
  buscarPorUidFirebase(uid: string): Partial<Auth> {
    return ({ rol: RolUsuario.ADMIN })
  }
}
