import { Body, Controller, Get, Patch, Post, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Roles } from "src/decorators/roles.decoratos";
import { RolUsuario } from "src/utils/enums/RolUsuarios.enum";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserCreateDTO } from "src/app/auth/dto/create-auth.dto";
import { UserUpdateDTO } from "../dto/update-auth.dto";

@ApiBearerAuth('firebase-auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO, RolUsuario.CLIENTE)
  @Get()
  login(@Request() req) {
    const { uid, email } = req.user;
    return this.authService.buscarPorUidFirebase(uid)
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

  @Patch("update-user-tech")
  updateUserTech(@Body()dto:UserUpdateDTO) {
    return this.authService.updateUserTech(dto)
  }
}
