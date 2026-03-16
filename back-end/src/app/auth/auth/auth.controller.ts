import { Body, Controller, Get, Param, Patch, Post, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Roles } from "src/decorators/roles.decoratos";
import { RolUsuario } from "src/utils/enums/RolUsuarios.enum";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserCreateDTO } from "src/app/auth/dto/create-auth.dto";
import { UserUpdateDTO } from "../dto/update-auth.dto";
import { Public } from "src/decorators/public.decorator";

@ApiBearerAuth('firebase-auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  @Get()
  login(@Request() req) {
    const { uid, email } = req.user;
    return this.authService.buscarPorUidFirebase(uid)
  }

  @Public()
  @Post("register")
  createUserClient(@Body() userCreateDTO: UserCreateDTO) {
    return this.authService.createUserTech({ ...userCreateDTO }, RolUsuario.CLIENTE)
  }

  @Roles(RolUsuario.ADMIN)
  @Post('create-user-tech')
  createUserTech(@Body() userCreateDTO: UserCreateDTO) {
    return this.authService.createUserTech(userCreateDTO)
  }
  @Roles(RolUsuario.ADMIN)
  @Get("list-user-tech")
  listUserTech() {
    return this.authService.listUserTech()
  }

  @Roles(RolUsuario.ADMIN)
  @Patch("update-user-tech")
  updateUserTech(@Body() dto: UserUpdateDTO) {
    return this.authService.updateUserTech(dto)
  }
  @Roles(RolUsuario.ADMIN)
  @Patch("disable-user-tech/:uid")
  disableUserTech(@Param("uid") uid: string) {
    return this.authService.disableUserTech(uid)
  }
}
