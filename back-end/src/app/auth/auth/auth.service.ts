import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDTO } from 'src/app/auth/dto/create-auth.dto';
import { Auth } from 'src/app/auth/entities/auth.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RolUsuario } from 'src/utils/enums/RolUsuarios.enum';
import { DataSource, Repository } from 'typeorm';
import { UserUpdateDTO } from '../dto/update-auth.dto';

/**
 * Servicio encargado de gestionar la lógica de autenticación, creación de usuarios
 * e integración entre la base de datos relacional y el servicio de Firebase Authentication.
 */
@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly dataSource: DataSource,
    private readonly firebaseService: FirebaseService
  ) { }

  /**
   * Busca un usuario en la base de datos mediante su UID de Firebase.
   * 
   * @param uid - Identificador único de Firebase del usuario.
   * @returns La entidad del usuario encontrado.
   * @throws {NotFoundException} Si el usuario no existe en la base de datos.
   */
  async buscarPorUidFirebase(uid: string): Promise<Partial<Auth>> {
    const user = await this.authRepository.findOneBy({ uidFirebase: uid });
    if (!user) throw new NotFoundException("User not found")
    return user;
  }

  /**
   * Crea un nuevo usuario tanto en Firebase Auth como en la base de datos del sistema.
   * Por defecto asigna el rol TECNICO si no se especifica otro.
   * 
   * @param userCreateDTO - DTO con los datos de creación (nombre, correo, contraseña).
   * @param rol - Rol a asignar al usuario (TECNICO, CLIENTE, etc.).
   * @returns La entidad del usuario guardada en base de datos.
   */
  async createUserTech(userCreateDTO: UserCreateDTO, rol: RolUsuario = RolUsuario.TECNICO) {
    const user = await this.firebaseService.createUserWithEmail(userCreateDTO.email, userCreateDTO.password, userCreateDTO.nombre)
    const userPreparatedForSaveInDataBase = this.authRepository.create({
      email: userCreateDTO.email,
      nombre: userCreateDTO.nombre,
      rol: rol,
      uidFirebase: user.uid
    })
    return await this.authRepository.save(userPreparatedForSaveInDataBase)

  }

  /**
   * Obtiene la lista de todos los usuarios registrados con el rol TECNICO.
   * 
   * @returns Un listado de usuarios técnicos.
   */
  async listUserTech() {
    const userTech = await this.authRepository.find({ where: { rol: RolUsuario.TECNICO } });
    return userTech;
  }

  /**
   * Actualiza el perfil de un usuario técnico (nombre y/o contraseña) usando una transacción de base de datos.
   * 
   * @param dto - DTO con los datos de actualización del usuario técnico.
   * @returns La entidad del usuario actualizado.
   * @throws {NotFoundException} Si el usuario no existe.
   */
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

  /**
   * Deshabilita un usuario técnico en Firebase Authentication.
   * 
   * @param uidFirebase - Identificador único de Firebase del usuario a desactivar.
   * @returns Objeto con el estado del usuario deshabilitado en Firebase.
   */
  async disableUserTech(uidFirebase: string) {
    const user = await this.firebaseService.disableUser(uidFirebase);
    return user;
  }

  /**
   * Busca un usuario técnico específico en la base de datos por su UID de Firebase.
   * 
   * @param uidFirebase - Identificador único de Firebase del usuario.
   * @returns La entidad del usuario técnico encontrado.
   * @throws {NotFoundException} Si el usuario no es encontrado o no posee el rol de técnico.
   */
  async findUserTechByUidFirebase(uidFirebase: string) {
    const user = await this.authRepository.findOneBy({ uidFirebase, rol: RolUsuario.TECNICO });
    if (!user) throw new NotFoundException("User not found")
    return user;
  }
  
}
