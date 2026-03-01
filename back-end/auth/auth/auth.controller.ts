import { Controller, Get, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Roles } from "src/decorators/roles.decoratos";
import { RolUsuario } from "src/utils/enums/RolUsuarios.enum";
import { ApiBearerAuth } from "@nestjs/swagger";

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


}
