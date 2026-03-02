import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDTO } from 'src/app/auth/dto/create-auth.dto';
import { Auth } from 'src/app/auth/entities/auth.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RolUsuario } from 'src/utils/enums/RolUsuarios.enum';
import { DataSource, Repository } from 'typeorm';
import { UserUpdateDTO } from '../dto/update-auth.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly dataSource: DataSource,
    private readonly firebaseService: FirebaseService
  ) { }
  async buscarPorUidFirebase(uid: string): Promise<Partial<Auth>> {
    const user = await this.authRepository.findOneBy({ uidFirebase: uid });
    if (!user) throw new NotFoundException("User not found")
    return user;
  }
  async createUserTech(userCreateDTO: UserCreateDTO) {
    const user = await this.firebaseService.createUserWithEmail(userCreateDTO.email, userCreateDTO.password, userCreateDTO.nombre)
    const userPreparatedForSaveInDataBase = this.authRepository.create({
      email: userCreateDTO.email,
      nombre: userCreateDTO.nombre,
      rol: RolUsuario.TECNICO,
      uidFirebase: user.uid
    })
    return await this.authRepository.save(userPreparatedForSaveInDataBase)

  }
  async listUserTech() {
    const userTech = await this.authRepository.find({ where: { rol: RolUsuario.TECNICO } });
    return userTech;
  }
  async updateUserTech(dto: UserUpdateDTO) {
    return this.dataSource.transaction(async (manager) => {

      const user = await manager.findOneBy(Auth, { email: dto.email });
      if (!user) throw new NotFoundException("User not Found")
      user.nombre = dto.nombre;
      const userUpdated = manager.save(user);
      if (dto.password)
        await this.firebaseService.updatePasswordUser(user.uidFirebase, dto.password)
      return userUpdated;
    })

  }
}
