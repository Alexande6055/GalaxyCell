import { Body, Controller, Get, Param, Patch, Post, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Roles } from "src/decorators/roles.decoratos";
import { RolUsuario } from "src/utils/enums/RolUsuarios.enum";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserCreateDTO } from "src/app/auth/dto/create-auth.dto";
import { UserUpdateDTO } from "../dto/update-auth.dto";
import { Public } from "src/decorators/public.decorator";

/**
 * Controlador que maneja las solicitudes HTTP para la autenticación y gestión de usuarios.
 * Protegido en su mayoría por autenticación de Firebase (definido globalmente) y con roles específicos.
 */
@ApiBearerAuth('firebase-auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  /**
   * Endpoint de login. Obtiene la información del usuario autenticado a través del request
   * (inyectado por el FirebaseGuard) y retorna la información de perfil en base de datos.
   * RUTA: GET /auth
   * 
   * @param req - Objeto de solicitud HTTP que contiene los datos del usuario decodificados del token.
   * @returns El perfil del usuario autenticado.
   */
  @Get()
  login(@Request() req) {
    const { uid, email } = req.user;
    return this.authService.buscarPorUidFirebase(uid)
  }

  /**
   * Endpoint público para registrar un nuevo usuario con rol CLIENTE.
   * RUTA: POST /auth/register
   * 
   * @param userCreateDTO - DTO con los datos de creación del cliente.
   * @returns El perfil del cliente creado.
   */
  @Public()
  @Post("register")
  createUserClient(@Body() userCreateDTO: UserCreateDTO) {
    return this.authService.createUserTech({ ...userCreateDTO }, RolUsuario.CLIENTE)
  }

  /**
   * Endpoint de administrador para registrar un nuevo usuario de soporte técnico (o admin).
   * RUTA: POST /auth/create-user-tech
   * 
   * @param userCreateDTO - DTO con la información de registro del usuario.
   * @returns El perfil del usuario técnico creado.
   */
  @Roles(RolUsuario.ADMIN)
  @Post('create-user-tech')
  createUserTech(@Body() userCreateDTO: UserCreateDTO) {
    return this.authService.createUserTech(userCreateDTO)
  }

  /**
   * Endpoint de administrador para listar a todos los usuarios técnicos/soporte.
   * RUTA: GET /auth/list-user-tech
   * 
   * @returns Listado de usuarios del equipo técnico.
   */
  @Roles(RolUsuario.ADMIN)
  @Get("list-user-tech")
  listUserTech() {
    return this.authService.listUserTech()
  }

  /**
   * Endpoint de administrador para actualizar la información de un usuario técnico.
   * RUTA: PATCH /auth/update-user-tech
   * 
   * @param dto - DTO con los datos actualizados del usuario.
   * @returns El perfil del usuario actualizado.
   */
  @Roles(RolUsuario.ADMIN)
  @Patch("update-user-tech")
  updateUserTech(@Body() dto: UserUpdateDTO) {
    return this.authService.updateUserTech(dto)
  }

  /**
   * Endpoint de administrador para deshabilitar a un usuario técnico por su UID.
   * RUTA: PATCH /auth/disable-user-tech/:uid
   * 
   * @param uid - Identificador único de Firebase del usuario a desactivar.
   * @returns El usuario deshabilitado.
   */
  @Roles(RolUsuario.ADMIN)
  @Patch("disable-user-tech/:uid")
  disableUserTech(@Param("uid") uid: string) {
    return this.authService.disableUserTech(uid)
  }
}
