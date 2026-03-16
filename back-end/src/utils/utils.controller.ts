import { Controller, Get } from "@nestjs/common";
import { RolUsuario } from "./enums/RolUsuarios.enum";
import { Public } from "src/decorators/public.decorator";
@Controller('utils')
export class UtilsController {

    @Public()
    @Get('roles')
    obtenerTipoUsuario() {
        return Object.entries(RolUsuario).map(([codigo, nombre]) => ({ codigo, nombre }))
    }

}
